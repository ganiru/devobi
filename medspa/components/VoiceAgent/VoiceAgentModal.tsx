// @ts-nocheck Transitional conversion: preserve the existing voice event payloads.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Mic, MicOff, Volume2, Sparkles, Settings, Send, 
  Cpu, Check
} from 'lucide-react';
import voiceAgent, { VOICE_PROVIDERS, GEMINI_VOICES, GEMINI_MODELS, DEFAULT_GEMINI_MODEL } from '../../services/voiceAgentService';
import AudioVisualizer from './AudioVisualizer';

export default function VoiceAgentModal({ isOpen, onClose, onOpenBooking }) {
  const [agentState, setAgentState] = useState('idle');
  const [messages, setMessages] = useState([

  ]);
  const [inputText, setInputText] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(voiceAgent.provider || VOICE_PROVIDERS.GEMINI_LIVE);
  const [geminiVoice, setGeminiVoice] = useState(voiceAgent.config.geminiVoice || 'Aoede');
  const [geminiModel, setGeminiModel] = useState(voiceAgent.config.geminiModel || DEFAULT_GEMINI_MODEL);
  const [keySaved, setKeySaved] = useState(false);
  const chatBottomRef = useRef(null);
  // Track which bubble ID is currently being streamed into per sender
  // so we never create a new bubble for mid-turn chunks
  const streamingBubbleRef = useRef({}); // { 'aura': bubbleId, 'user': bubbleId }

  useEffect(() => {
    const unsubState = voiceAgent.subscribe('state', (state) => {
      setAgentState(state);
    });

    const unsubTranscript = voiceAgent.subscribe('transcript', ({ turnId, sender, text, isFinal }) => {
      if (!text) return;

      const streaming = streamingBubbleRef.current;

      setMessages(prev => {
        // ── Priority 1: A turnId was provided by the service ──────────────────
        if (turnId) {
          const index = prev.findIndex(m => m.id === turnId);
          if (index !== -1) {
            // Bubble already exists – update it in place
            const updated = [...prev];
            updated[index] = { ...updated[index], text, isFinal: isFinal !== false };
            if (isFinal !== false) delete streaming[sender];
            else streaming[sender] = turnId;
            return updated;
          } else {
            // First chunk for this turn – create the bubble
            streaming[sender] = turnId;
            return [
              ...prev,
              {
                id: turnId,
                sender,
                text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isFinal: isFinal !== false
              }
            ];
          }
        }

        // ── Priority 2: No turnId – check if there is an active streaming bubble ──
        const activeBubbleId = streaming[sender];
        if (activeBubbleId) {
          const index = prev.findIndex(m => m.id === activeBubbleId);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...updated[index], text, isFinal: isFinal !== false };
            if (isFinal !== false) delete streaming[sender];
            return updated;
          }
        }

        // ── Priority 3: No turnId and no active bubble – check last bubble ──
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === sender && lastMsg.isFinal === false) {
          const updated = [...prev];
          updated[updated.length - 1] = { ...lastMsg, text, isFinal: isFinal !== false };
          if (isFinal !== false) delete streaming[sender];
          else streaming[sender] = lastMsg.id;
          return updated;
        }

        // ── Priority 4: Append a brand-new bubble ──────────────────────────────
        const newId = Date.now() + Math.random();
        if (isFinal === false) streaming[sender] = newId;
        return [
          ...prev,
          {
            id: newId,
            sender,
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isFinal: isFinal !== false
          }
        ];
      });
    });

    return () => {
      unsubState();
      unsubTranscript();
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentState]);

  useEffect(() => {
    if (isOpen) {
      // If Gemini Live is selected and key is present from env, start session
      if (selectedProvider === VOICE_PROVIDERS.BROWSER_MOCK) {
        voiceAgent.startSession();
      } else {
        voiceAgent.startSession();
      }
    }
    // Cleanup: end session when modal closes
    return () => {
      voiceAgent.endSession();
    };
  }, [isOpen, selectedProvider]);

  const handleMicToggle = () => {
    if (agentState === 'idle') {
      voiceAgent.startListening();
    } else {
      // End session for any active state: listening, speaking, connecting, thinking
      voiceAgent.endSession();
    }
  };

  const handleSendText = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    setMessages(prev => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        sender: 'user',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFinal: true
      }
    ]);
    voiceAgent.handleUserVoiceInput(text);
  };

  const handlePromptClick = (prompt) => {
    setMessages(prev => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        sender: 'user',
        text: prompt,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFinal: true
      }
    ]);
    voiceAgent.handleUserVoiceInput(prompt);
  };

  const handleSaveConfig = () => {
    voiceAgent.configureProvider(selectedProvider, {
      geminiVoice: geminiVoice,
      geminiModel: geminiModel
    });
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
    setShowConfig(false);

    // Restart with updated config
    voiceAgent.endSession();
    setTimeout(() => {
      voiceAgent.startSession();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="voice-modal-overlay">
      <div className="voice-dock-container glass-panel animate-fade-in" role="dialog" aria-modal="true">
        
        {/* Header */}
        <div className="voice-dock-header">
          <div className="voice-dock-title-group">
            <div className="aura-avatar-glow">
              <Sparkles className="aura-sparkle-icon" />
            </div>
            <div>
              <div className="aura-name-row">
                <h3 className="aura-name">Aura AI</h3>
              </div>
              <p className="aura-status-subtext">
                <span className={`status-dot ${agentState}`}></span>
                {agentState === 'speaking' ? 'Aura is speaking...' :
                 agentState === 'listening' ? 'Listening to your voice...' :
                 agentState === 'thinking' ? 'Gemini 3.1 is processing...' :
                 agentState === 'connecting' ? 'Connecting to Gemini Live...' :
                 'Live Voice Ready'}
              </p>
            </div>
          </div>

          <div className="voice-dock-actions">
            <button 
              id="btn-voice-settings"
              onClick={() => setShowConfig(!showConfig)} 
              className={`icon-btn ${showConfig ? 'active' : ''}`}
              title="Voice AI Provider & Key Settings"
              aria-label="Voice AI Provider & Key Settings"
            >
              <Settings size={18} />
            </button>
            <button 
              id="btn-close-voice"
              onClick={() => {
                voiceAgent.endSession();
                onClose();
              }} 
              className="icon-btn close-btn"
              title="Close Voice Assistant"
              aria-label="Close Voice Assistant"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Settings Drawer */}
        {showConfig && (
          <div className="voice-config-drawer">
            <div className="config-drawer-header">
              <Cpu size={16} className="text-gold" />
              <h4>Google Gemini Live Voice Settings</h4>
            </div>
            
            <div className="provider-select-group">
              <label>AI Voice Engine:</label>
              <select 
                value={selectedProvider} 
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="config-select"
              >
                <option value={VOICE_PROVIDERS.GEMINI_LIVE}>Google Gemini Multimodal Live (Real-Time Audio)</option>
                <option value={VOICE_PROVIDERS.BROWSER_MOCK}>Browser Web Speech (Local Fallback Demo)</option>
              </select>
            </div>

            {selectedProvider === VOICE_PROVIDERS.GEMINI_LIVE && (
              <div className="provider-fields">
                <div className="field-group">
                  <div className="api-key-status">
                    <span className="status-text success">✓ Gemini is securely connected through the Devobi server</span>
                  </div>
                  <span className="field-hint">
                    The API key remains on the server and is never included in browser code.
                  </span>
                </div>

                <div className="field-group">
                  <label><Cpu size={12} /> Gemini Live Model</label>
                  <select 
                    value={geminiModel} 
                    onChange={(e) => setGeminiModel(e.target.value)}
                    className="config-select"
                  >
                    {GEMINI_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label><Volume2 size={12} /> Gemini Live Voice Persona</label>
                  <select 
                    value={geminiVoice} 
                    onChange={(e) => setGeminiVoice(e.target.value)}
                    className="config-select"
                  >
                    {GEMINI_VOICES.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="config-footer">
              <span className="file-hint">Model: <code>{geminiModel.replace('models/', '')}</code></span>
              <button onClick={handleSaveConfig} className="btn-save-config">
                {keySaved ? (
                  <>
                    <Check size={12} /> Saved!
                  </>
                ) : (
                  'Connect & Save'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Visualizer Hero Area */}
        <div className="voice-visualizer-container">
          <AudioVisualizer state={agentState} color="#C5A880" />
          <div className="visualizer-hint">
            {agentState === 'listening' ? '🟢 Live microphone streaming...' :
             agentState === 'speaking' ? '🔊 Speaking...' :
             agentState === 'thinking' ? '✨ Reasoning...' :
             agentState === 'connecting' ? 'Connecting ...' :
             'Tap the microphone to start real-time conversation'}
          </div>
        </div>

        {/* Chat / Transcript Stream */}
        <div className="voice-transcript-feed">
          {messages.map((m) => (
            <div key={m.id} className={`transcript-bubble-wrap ${m.sender}`}>
              <div className="transcript-bubble">
                <p className="bubble-text">{m.text}</p>
                <span className="bubble-time">{m.time}</span>
              </div>
            </div>
          ))}

          {agentState === 'thinking' && (
            <div className="transcript-bubble-wrap aura">
              <div className="transcript-bubble thinking-bubble">
                <span className="dot-flashing"></span>
                <span className="thinking-text">Gemini Live is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Voice Prompt Chips */}
        <div className="voice-prompt-chips">
          <button 
            className="prompt-chip" 
            onClick={() => handlePromptClick("How does Morpheus8 RF microneedling remodel facial collagen, and what is the downtime?")}
          >
            "Morpheus8 downtime & science?"
          </button>
          <button 
            className="prompt-chip" 
            onClick={() => handlePromptClick("Does Botox look stiff, or how do you achieve natural results?")}
          >
            "Natural Botox results?"
          </button>
          <button 
            className="prompt-chip" 
            onClick={() => handlePromptClick("What is your red-carpet glow treatment before an event?")}
          >
            "Red-carpet event glow?"
          </button>
          <button 
            className="prompt-chip highlight-chip" 
            onClick={() => {
              voiceAgent.endSession();
              onClose();
              onOpenBooking();
            }}
          >
            🗓️ "Reserve Consultation"
          </button>
        </div>

        {/* Bottom Interactive Mic Bar */}
        <div className="voice-dock-controls">
          <form onSubmit={handleSendText} className="voice-text-input-form">
            <input 
              type="text" 
              placeholder="Type or speak to Gemini Live..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="voice-text-input"
            />
            <button 
              type="submit" 
              className="voice-send-btn" 
              disabled={!inputText.trim()}
              aria-label="Send message to Gemini"
            >
              <Send size={16} />
            </button>
          </form>

          <button 
            id="btn-voice-mic-toggle"
            onClick={handleMicToggle}
            className={`voice-mic-main-btn ${
              agentState === 'listening' ? 'active-listening' :
              agentState === 'speaking'  ? 'active-speaking' :
              agentState !== 'idle'      ? 'active-listening' : ''
            }`}
            title={agentState === 'idle' ? 'Start live speaking' : 'Stop session'}
            aria-label={agentState === 'idle' ? 'Start live speaking' : 'Stop session'}
          >
            {agentState !== 'idle' ? (
              <MicOff size={22} className="mic-icon pulse" />
            ) : (
              <Mic size={22} className="mic-icon" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
