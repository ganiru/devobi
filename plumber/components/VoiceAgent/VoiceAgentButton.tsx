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

  const stateToIcon = {
    speaking: <Volume2 className="voice-icon pulse" />,
    listening: <Mic className="voice-icon active-mic" />,
    thinking: <Sparkles className="voice-icon think" />,
    idle: <Sparkles className="voice-icon" />
  };

  const stateToTooltip = {
    speaking: "Aura is speaking...",
    listening: "Listening to you...",
    thinking: "Analyzing your concern...",
    idle: "Speak with Aura Plumbing Assistant"
  };

  return (
    <div className={`floating-voice-widget${isOpen ? ' active' : ''}`}>
      <button 
        id="btn-open-voice-agent"
        onClick={onClick}
        className="voice-orb-button"
        aria-label="Speak with Aura, AI Plumbing Expert"
      >
        <div className="voice-orb-glow"></div>
        <div className="voice-orb-ring"></div>
        <div className="voice-orb-inner">
          {stateToIcon[agentState]}
        </div>

        <div className="voice-orb-tooltip">
          <span className="tooltip-badge">Aura</span>
          <span className="tooltip-text">{stateToTooltip[agentState]}</span>
        </div>
      </button>
    </div>
  );
}
