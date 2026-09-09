// @ts-nocheck Transitional conversion: preserve the existing voice event payloads.
import React, { useState, useEffect, useRef } from 'react';
import {
  X, Mic, MicOff, Volume2, Sparkles, Settings, Send,
  Cpu, Check
} from 'lucide-react';
import voiceAgent, {
  VOICE_PROVIDERS,
  GEMINI_VOICES, GEMINI_MODELS, DEFAULT_GEMINI_MODEL,
  OPENAI_VOICES, DEFAULT_OPENAI_MODEL
} from '../../services/voiceAgentService';
import AudioVisualizer from './AudioVisualizer';

export default function VoiceAgentModal({ isOpen, onClose, onOpenBooking }) {
  const [agentState, setAgentState] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(voiceAgent.provider || VOICE_PROVIDERS.OPENAI_REALTIME);
  const [geminiVoice, setGeminiVoice] = useState(voiceAgent.runtimeConfig?.geminiVoice || 'Aoede');
  const [geminiModel, setGeminiModel] = useState(voiceAgent.runtimeConfig?.geminiModel || DEFAULT_GEMINI_MODEL);
  const [openaiVoice, setOpenaiVoice] = useState(voiceAgent.runtimeConfig?.openaiVoice || 'marin');
  const [keySaved, setKeySaved] = useState(false);
  const chatBottomRef = useRef(null);
  const streamingBubbleRef = useRef({});

  useEffect(() => {
    const unsubState = voiceAgent.subscribe('state', (state) => {
      setAgentState(state);
    });

    const unsubTranscript = voiceAgent.subscribe('transcript', ({ turnId, sender, text, isFinal }) => {
      if (!text) return;
      const streaming = streamingBubbleRef.current;

      setMessages(prev => {
        if (turnId) {
          const index = prev.findIndex(m => m.id === turnId);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...updated[index], text, isFinal: isFinal !== false };
            if (isFinal !== false) delete streaming[sender];
            else streaming[sender] = turnId;
            return updated;
          } else {
            streaming[sender] = turnId;
            return [
              ...prev,
              { id: turnId, sender, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isFinal: isFinal !== false }
            ];
          }
        }

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

        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === sender && lastMsg.isFinal === false) {
          const updated = [...prev];
          updated[updated.length - 1] = { ...lastMsg, text, isFinal: isFinal !== false };
          if (isFinal !== false) delete streaming[sender];
          else streaming[sender] = lastMsg.id;
          return updated;
        }

        const newId = Date.now() + Math.random();
        if (isFinal === false) streaming[sender] = newId;
        return [
          ...prev,
          { id: newId, sender, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isFinal: isFinal !== false }
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
      voiceAgent.configureProvider(selectedProvider, {
        geminiVoice,
        geminiModel,
        openaiVoice
      });
      voiceAgent.startSession();
    }
    return () => {
      voiceAgent.endSession();
    };
  }, [isOpen]);

  const handleMicToggle = () => {
    if (agentState === 'idle') {
      voiceAgent.startListening();
    } else {
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
      { id: 'user-' + Date.now(), sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isFinal: true }
    ]);
    voiceAgent.handleUserVoiceInput(text);
  };

  const handlePromptClick = (prompt) => {
    setMessages(prev => [
      ...prev,
      { id: 'user-' + Date.now(), sender: 'user', text: prompt, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isFinal: true }
    ]);
    voiceAgent.handleUserVoiceInput(prompt);
  };

  const handleSaveConfig = () => {
    voiceAgent.configureProvider(selectedProvider, { geminiVoice, geminiModel, openaiVoice });
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
    setShowConfig(false);
    voiceAgent.endSession();
    setTimeout(() => voiceAgent.startSession(), 300);
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
              <h3 className="aura-name">Aura AI</h3>
              <p className="aura-status-subtext">
                <span className={`status-dot ${agentState}`}></span>
                {agentState === 'speaking' ? 'Aura is speaking...' :
                 agentState === 'listening' ? 'Listening to your voice...' :
                 agentState === 'thinking' ? 'Aura is processing...' :
                 agentState === 'connecting' ? 'Connecting to Aura...' :
                 'Live Voice Ready'}
              </p>
            </div>
          </div>

          <div className="voice-dock-actions">
            <button
              id="btn-voice-settings"
              onClick={() => setShowConfig(!showConfig)}
              className={`icon-btn ${showConfig ? 'active' : ''}`}
              title="Voice AI Settings"
              aria-label="Voice AI Settings"
            >
              <Settings size={18} />
            </button>
            <button
              id="btn-close-voice"
              onClick={() => { voiceAgent.endSession(); onClose(); }}
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
              <Cpu size={16} className="text-blue" />
              <h4>Voice AI Settings</h4>
            </div>

            <div className="provider-select-group">
              <label>AI Voice Engine:</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="config-select"
              >
                <option value={VOICE_PROVIDERS.OPENAI_REALTIME}>OpenAI Realtime (WebRTC, Cedar/Marin)</option>
                <option value={VOICE_PROVIDERS.GEMINI_LIVE}>Google Gemini Live (Real-Time Audio)</option>
                <option value={VOICE_PROVIDERS.BROWSER_MOCK}>Browser Web Speech (Local Fallback)</option>
              </select>
            </div>

            {selectedProvider === VOICE_PROVIDERS.GEMINI_LIVE && (
              <div className="provider-fields">
                <div className="field-group">
                  <div className="api-key-status">
                    <span className="status-text success">✓ Aura is securely connected through the Devobi server</span>
                  </div>
                  <span className="field-hint">The API key stays on the server and is never exposed in the browser.</span>
                </div>

                <div className="field-group">
                  <label><Cpu size={12} /> Gemini Live Model</label>
                  <select value={geminiModel} onChange={(e) => setGeminiModel(e.target.value)} className="config-select">
                    {GEMINI_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label><Volume2 size={12} /> Gemini Live Voice Persona</label>
                  <select value={geminiVoice} onChange={(e) => setGeminiVoice(e.target.value)} className="config-select">
                    {GEMINI_VOICES.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedProvider === VOICE_PROVIDERS.OPENAI_REALTIME && (
              <div className="provider-fields">
                <div className="field-group">
                  <div className="api-key-status">
                    <span className="status-text success">✓ Connected via WebRTC using a short-lived server token</span>
                  </div>
                  <span className="field-hint">The browser talks to OpenAI directly over WebRTC; your API key never leaves the Devobi server.</span>
                </div>

                <div className="field-group">
                  <label><Cpu size={12} /> OpenAI Realtime Model</label>
                  <select value={DEFAULT_OPENAI_MODEL} disabled className="config-select">
                    <option value={DEFAULT_OPENAI_MODEL}>{DEFAULT_OPENAI_MODEL}</option>
                  </select>
                  <span className="field-hint">Model is fixed server-side for this demo.</span>
                </div>

                <div className="field-group">
                  <label><Volume2 size={12} /> OpenAI Voice Persona</label>
                  <select value={openaiVoice} onChange={(e) => setOpenaiVoice(e.target.value)} className="config-select">
                    {OPENAI_VOICES.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="config-footer">
              <span className="file-hint">
                {selectedProvider === VOICE_PROVIDERS.OPENAI_REALTIME
                  ? <>Model: <code>{DEFAULT_OPENAI_MODEL}</code></>
                  : <>Model: <code>{geminiModel.replace('models/', '')}</code></>}
              </span>
              <button onClick={handleSaveConfig} className="btn-save-config">
                {keySaved ? (<><Check size={12} /> Saved!</>) : ('Connect & Save')}
              </button>
            </div>
          </div>
        )}

        {/* Visualizer */}
        <div className="voice-visualizer-container">
          <AudioVisualizer state={agentState} color="#2FA6FF" />
          <div className="visualizer-hint">
            {agentState === 'listening' ? '🟢 Live microphone streaming...' :
             agentState === 'speaking' ? '🔊 Aura is speaking...' :
             agentState === 'thinking' ? '✨ Reasoning...' :
             agentState === 'connecting' ? 'Connecting ...' :
             'Tap the microphone to start a real-time conversation'}
          </div>
        </div>

        {/* Transcript Stream */}
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
                <span className="thinking-text">Aura is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="voice-prompt-chips">
          <button className="prompt-chip" onClick={() => handlePromptClick("Is emergency dispatch available right now?")}>
            "Emergency dispatch?"
          </button>
          <button className="prompt-chip" onClick={() => handlePromptClick("What do you charge for drain cleaning?")}>
            "Drain cleaning cost?"
          </button>
          <button className="prompt-chip" onClick={() => handlePromptClick("Can you replace my water heater?")}>
            "Water heater service?"
          </button>
          <button className="prompt-chip highlight-chip" onClick={() => { voiceAgent.endSession(); onClose(); onOpenBooking(); }}>
            📅 "Schedule Service"
          </button>
        </div>

        {/* Bottom Mic Bar */}
        <div className="voice-dock-controls">
          <form onSubmit={handleSendText} className="voice-text-input-form">
            <input
              type="text"
              placeholder="Type or speak to Aura..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="voice-text-input"
            />
            <button type="submit" className="voice-send-btn" disabled={!inputText.trim()} aria-label="Send message">
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