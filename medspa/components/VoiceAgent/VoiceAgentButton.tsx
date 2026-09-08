// @ts-nocheck Transitional conversion: preserve the existing component API.
import React, { useState, useEffect } from 'react';
import { Mic, Sparkles, Volume2 } from 'lucide-react';
import voiceAgent from '../../services/voiceAgentService';

export default function VoiceAgentButton({ onClick, isOpen }) {
  const [agentState, setAgentState] = useState('idle');

  useEffect(() => {
    const unsub = voiceAgent.subscribe('state', (newState) => {
      setAgentState(newState);
    });
    return unsub;
  }, []);

  return (
    <div className={`floating-voice-widget ${isOpen ? 'active' : ''}`}>
      <button 
        id="btn-open-voice-agent"
        onClick={onClick}
        className="voice-orb-button"
        aria-label="Speak with Aura, AI Aesthetic Concierge"
      >
        <div className="voice-orb-glow"></div>
        <div className="voice-orb-ring"></div>
        
        <div className="voice-orb-inner">
          {agentState === 'speaking' ? (
            <Volume2 className="voice-icon pulse" />
          ) : agentState === 'listening' ? (
            <Mic className="voice-icon active-mic" />
          ) : (
            <Sparkles className="voice-icon" />
          )}
        </div>

        <div className="voice-orb-tooltip">
          <span className="tooltip-badge">Aura AI</span>
          <span className="tooltip-text">
            {agentState === 'speaking' ? 'Aura is speaking...' :
             agentState === 'listening' ? 'Listening to you...' :
             agentState === 'thinking' ? 'Analyzing...' :
             'Speak with Aura Concierge'}
          </span>
        </div>
      </button>
    </div>
  );
}
