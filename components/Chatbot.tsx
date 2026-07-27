
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { chatWithGemini, SYSTEM_INSTRUCTION } from '../services/geminiService';
import { Message } from '../types';

// Audio Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! I'm the Devobi assistant. How can I help you automate your lead follow-up today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice Refs
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const liveSessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptionRef = useRef({ user: '', model: '' });
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isVoiceActive]);

  const stopVoice = () => {
    // 1. Close session
    if (liveSessionRef.current) {
      try { liveSessionRef.current.close(); } catch(e) {}
      liveSessionRef.current = null;
    }

    // 2. Stop microphone tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // 3. Disconnect nodes
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current.onaudioprocess = null;
      scriptProcessorRef.current = null;
    }

    // 4. Close contexts
    if (audioContextRef.current) {
      try { audioContextRef.current.input.close(); } catch(e) {}
      try { audioContextRef.current.output.close(); } catch(e) {}
      audioContextRef.current = null;
    }

    // 5. Cleanup playback
    activeSourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;

    setIsVoiceActive(false);
    setIsConnecting(false);
  };

  const startVoice = async () => {
    if (isConnecting || isVoiceActive) return;
    
    try {
      setIsConnecting(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputAudioContext, output: outputAudioContext };
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsVoiceActive(true);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                if (liveSessionRef.current) {
                  session.sendRealtimeInput({ media: pcmBlob });
                }
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current.output;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => activeSourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              activeSourcesRef.current.add(source);
            }

            // Real-time transcriptions - update as they arrive for better UX
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              transcriptionRef.current.user += text;
            }
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              transcriptionRef.current.model += text;
            }

            // When a turn is complete, finalize the messages
            if (message.serverContent?.turnComplete) {
              const u = transcriptionRef.current.user;
              const m = transcriptionRef.current.model;
              if (u || m) {
                setMessages(prev => {
                  const newMsgs = [...prev];
                  if (u) newMsgs.push({ role: 'user', content: u });
                  if (m) newMsgs.push({ role: 'assistant', content: m });
                  return newMsgs;
                });
              }
              transcriptionRef.current = { user: '', model: '' };
            }

            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Voice error:', e);
            stopVoice();
          },
          onclose: () => {
            console.log('Voice session closed');
            stopVoice();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });

      const session = await sessionPromise;
      liveSessionRef.current = session;

    } catch (err) {
      console.error("Failed to start voice:", err);
      stopVoice();
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const response = await chatWithGemini(messages, inputValue);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const toggleVoice = () => {
    if (isConnecting) return;
    if (isVoiceActive) stopVoice();
    else startVoice();
  };

  const renderMessageContent = (msg: Message) => {
    return (
      <ReactMarkdown
        components={{
          ul: ({ ...props }) => <ul className="list-disc ml-5 mb-3 space-y-1" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal ml-5 mb-3 space-y-1" {...props} />,
          li: ({ ...props }) => <li className="mb-1" {...props} />,
          p: ({ ...props }) => <p className="mb-3 last:mb-0" {...props} />,
          a: ({ ...props }) => <a className="text-accent hover:text-accent-dark underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
          strong: ({ ...props }) => <strong className="font-bold text-ink" {...props} />,
          code: ({ ...props }) => <code className="bg-line/50 px-1 rounded text-accent font-mono text-xs" {...props} />,
          blockquote: ({ ...props }) => <blockquote className="border-l-2 border-accent pl-3 italic text-muted my-2" {...props} />,
        }}
      >
        {msg.content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 active:scale-90 ${isOpen ? 'bg-accent rotate-90' : 'bg-accent hover:bg-accent-dark'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-white dark:bg-gray-900 border border-line rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-accent p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white/70"></div>
              <div>
                <div className="font-bold text-white text-sm">
                  Devobi Expert
                </div>
                <div className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Lead Reactivation</div>
              </div>
            </div>
            {/* Microphone button hidden — voice mode temporarily disabled
            <button 
              onClick={toggleVoice} 
              disabled={isConnecting}
              title={isVoiceActive ? "Stop Voice Mode" : "Start Voice Mode"}
              className={`p-2 rounded-full transition-all duration-200 ${isVoiceActive ? 'bg-accent text-white shadow-lg shadow-accent/20' : (isConnecting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 text-white/70')}`}
            >
              <svg className={`w-5 h-5 ${isConnecting ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isConnecting ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                )}
              </svg>
            </button>
            */}
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-accent text-white rounded-br-none shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-800 text-ink border border-line rounded-bl-none'
                  }`}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-line">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-line flex gap-2 items-center shrink-0 bg-cream dark:bg-gray-900">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about lead reactivation..."
              disabled={false}
              className="flex-grow bg-white/80 dark:bg-black/20 border border-line p-2.5 rounded-lg outline-none focus:border-accent/50 transition-all text-sm text-ink placeholder:text-muted/50 disabled:opacity-50"
            />
            
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-accent hover:bg-accent-dark text-white p-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:grayscale active:scale-95 shadow-lg shadow-accent/10"
            >
              <svg className="w-5 h-5" style={{ transform: 'rotate(90deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-line);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-muted);
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
