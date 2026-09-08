// @ts-nocheck Transitional conversion: preserve the existing component API.
import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, Check, Mic, Calendar } from 'lucide-react';
import voiceAgent from '../../services/voiceAgentService';

export default function TreatmentQuiz({ onOpenVoice, onSelectTreatmentForBooking }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    goal: '',
    downtime: '',
    experience: ''
  });

  const handleSelect = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(prev => prev + 1);
  };

  const handleReset = () => {
    setAnswers({ goal: '', downtime: '', experience: '' });
    setStep(1);
  };

  // Determine recommendation based on answers
  const getRecommendation = () => {
    if (answers.goal === 'tightening') {
      return {
        title: 'The Mandibular Sculpt Protocol',
        primary: 'Morpheus8 RF Microneedling (3 Sessions)',
        secondary: 'Submental Precision Neurotoxin Nefertiti Lift',
        timeline: '8 - 12 Weeks for Full Neocollagenesis',
        voicePrompt: 'Tell me more about the Mandibular Sculpt Protocol and Morpheus8.'
      };
    } else if (answers.goal === 'radiance') {
      return {
        title: 'The Red-Carpet Luminescence Ritual',
        primary: 'Platinum HydraFacial + Lymphatic Drainage',
        secondary: 'Clear + Brilliant Perméa Laser Infusion',
        timeline: 'Immediate Glow, Cumulative monthly texture refinement',
        voicePrompt: 'Can you explain the Red Carpet Luminescence Ritual?'
      };
    } else if (answers.goal === 'lines') {
      return {
        title: 'The Micro-Dose Architectural Softening',
        primary: 'Micro-Targeted Botox / Dysport Balancing',
        secondary: 'SkinVive Deep Hydration Micro-Droplets',
        timeline: '5 - 7 Days to Full Blossom, Lasts 4 Months',
        voicePrompt: 'What is the Micro-Dose Architectural Softening with Botox?'
      };
    } else {
      return {
        title: 'The Cellular Longevity & Vitality Suite',
        primary: 'High-Dose NAD+ Intravenous Infusion',
        secondary: 'Glutathione Master Antioxidant Push + Vitamin D3',
        timeline: 'Instant cognitive clarity & cellular recovery',
        voicePrompt: 'What are the benefits of the Cellular Longevity NAD+ Suite?'
      };
    }
  };

  const result = getRecommendation();

  return (
    <section id="quiz" className="quiz-section">
      <div className="section-container">
        
        <div className="section-header-center">
          <div className="section-tag">
            <Sparkles />
            <span>Interactive Assessment</span>
          </div>
          <h2 className="section-title">
            AI Skin & Longevity <span className="text-gold-gradient">Protocol Matcher</span>
          </h2>
          <p className="section-desc">
            Answer 3 quick clinical questions to identify your customized treatment blueprint.
          </p>
        </div>

        <div className="quiz-card-wrapper glass-panel">
          
          {/* Progress Indicators */}
          <div className="quiz-progress-bar">
            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>3</div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>Result</div>
          </div>

          {/* Step 1: Goal */}
          {step === 1 && (
            <div className="quiz-step-content">
              <h3 className="quiz-question">What is your primary aesthetic or vitality objective?</h3>
              <div className="quiz-options-grid">
                <button 
                  className="quiz-option-btn" 
                  onClick={() => handleSelect('goal', 'tightening')}
                >
                  <div className="option-title">Facial Sculpting & Jawline Tightening</div>
                  <div className="option-sub">Remodel collagen, sharpen contours, firm skin laxity</div>
                </button>
                <button 
                  className="quiz-option-btn" 
                  onClick={() => handleSelect('goal', 'radiance')}
                >
                  <div className="option-title">Glass Skin & Red-Carpet Radiance</div>
                  <div className="option-sub">Clear pores, brighten pigmentation, deeply hydrate</div>
                </button>
                <button 
                  className="quiz-option-btn" 
                  onClick={() => handleSelect('goal', 'lines')}
                >
                  <div className="option-title">Expression Softening & Wrinkle Prevention</div>
                  <div className="option-sub">Natural forehead, crow's feet, and frown line softening</div>
                </button>
                <button 
                  className="quiz-option-btn" 
                  onClick={() => handleSelect('goal', 'longevity')}
                >
                  <div className="option-title">Cellular Longevity & Deep Energy</div>
                  <div className="option-sub">NAD+ IV therapy, mitochondrial repair, anti-fatigue</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Downtime */}
          {step === 2 && (
            <div className="quiz-step-content">
              <h3 className="quiz-question">What is your downtime availability?</h3>
              <div className="quiz-options-grid">
                <button 
                  className="quiz-option-btn" 
                  onClick={() => handleSelect('downtime', 'none')}
                >
                  <div className="option-title">Zero Social Downtime</div>
                  <div className="option-sub">I need to attend meetings or dinners immediately</div>
                </button>
                <button 
                  className="quiz-option-btn" 
                  onClick={() => handleSelect('downtime', 'mild')}
                >
                  <div className="option-title">1 - 2 Days of Mild Pinkness</div>
                  <div className="option-sub">A weekend recovery window works great for me</div>
                </button>
                <button 
                  className="quiz-option-btn" 
                  onClick={() => handleSelect('downtime', 'moderate')}
                >
                  <div className="option-title">3+ Days for Maximum Transformation</div>
                  <div className="option-sub">Willing to take recovery time for radical clinical results</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {step === 3 && (
            <div className="quiz-step-content">
              <h3 className="quiz-question">What is your aesthetic medicine experience?</h3>
              <div className="quiz-options-grid">
                <button 
                  className="quiz-option-btn" 
                  onClick={() => handleSelect('experience', 'new')}
                >
                  <div className="option-title">First Time Exploring MedSpa Therapies</div>
                  <div className="option-sub">I prefer a gentle, conservative, natural introduction</div>
                </button>
                <button 
                  className="quiz-option-btn" 
                  onClick={() => handleSelect('experience', 'experienced')}
                >
                  <div className="option-title">Regular Client (Injectables / Lasers)</div>
                  <div className="option-sub">Looking for state-of-the-art updates to my maintenance</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && (
            <div className="quiz-result-content">
              <div className="result-badge">
                <Sparkles size={14} />
                <span>Your Bespoke Clinical Recommendation</span>
              </div>
              
              <h3 className="result-protocol-name">{result.title}</h3>

              <div className="protocol-breakdown-card">
                <div className="protocol-row">
                  <span className="row-tag">Primary Therapy</span>
                  <div className="row-content">
                    <strong>{result.primary}</strong>
                    <p>Clinical centerpiece for targeted cellular transformation.</p>
                  </div>
                </div>

                <div className="protocol-row">
                  <span className="row-tag">Synergy Booster</span>
                  <div className="row-content">
                    <strong>{result.secondary}</strong>
                    <p>Amplifies healing, cellular hydration, and longevity.</p>
                  </div>
                </div>

                <div className="protocol-row">
                  <span className="row-tag">Expected Timeline</span>
                  <div className="row-content">
                    <strong>{result.timeline}</strong>
                  </div>
                </div>
              </div>

              <div className="result-actions">
                <button 
                  onClick={() => {
                    voiceAgent.handleUserVoiceInput(result.voicePrompt);
                    onOpenVoice();
                  }}
                  className="btn btn-secondary"
                >
                  <Mic size={16} className="text-gold" />
                  <span>Ask Aura AI About This</span>
                </button>

                <button 
                  onClick={() => onSelectTreatmentForBooking(result.primary)}
                  className="btn btn-primary"
                >
                  <Calendar size={16} />
                  <span>Book This Protocol</span>
                </button>

                <button 
                  onClick={handleReset} 
                  className="btn-quiz-reset"
                  title="Retake Quiz"
                >
                  <RotateCcw size={14} />
                  <span>Retake</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
