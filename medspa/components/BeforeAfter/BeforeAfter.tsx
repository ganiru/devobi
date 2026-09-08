// @ts-nocheck Transitional conversion: preserve the existing component API.
import React, { useState } from 'react';
import { Sparkles, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

const CASE_STUDIES = [
  {
    id: 1,
    title: 'Subdermal Jawline & Neck Contouring',
    treatment: 'Morpheus8 RF Microneedling (3 Sessions)',
    patient: 'Female, Age 42',
    timeframe: '12 Weeks Post-Final Session',
    beforeImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    notes: 'Significant tightening of submental laxity, sharper mandibular margin, and refined epidermal texture.'
  },
  {
    id: 2,
    title: 'Structural Midface & Lip Balancing',
    treatment: 'Micro-Droplet Hyaluronic Architecture (1.5 Syringes)',
    patient: 'Female, Age 34',
    timeframe: '4 Weeks Post-Treatment',
    beforeImg: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
    notes: 'Restoration of natural malar volume, symmetrical vermilion border definition, no over-projection.'
  }
];

export default function BeforeAfter({ onOpenBooking }) {
  const [selectedCase, setSelectedCase] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const currentCase = CASE_STUDIES[selectedCase];

  const handleSliderChange = (e) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <section id="before-after" className="before-after-section">
      <div className="section-container">
        
        <div className="section-header-center">
          <div className="section-tag">
            <Sparkles />
            <span>Clinical Evidence</span>
          </div>
          <h2 className="section-title">
            Untouched <span className="text-gold-gradient">Clinical Transformations</span>
          </h2>
          <p className="section-desc">
            Standardized medical photography under cross-polarized lighting. 
            Real patients, documented results, zero artificial filters.
          </p>
        </div>

        <div className="case-study-selector">
          {CASE_STUDIES.map((c, idx) => (
            <button 
              key={c.id} 
              className={`case-pill ${selectedCase === idx ? 'active' : ''}`}
              onClick={() => setSelectedCase(idx)}
            >
              <span>Case #{idx + 1}: {c.title}</span>
            </button>
          ))}
        </div>

        {/* Interactive Comparison Slider Container */}
        <div className="slider-wrapper glass-panel">
          <div className="slider-canvas-container">
            
            {/* After Image (Full width background) */}
            <img 
              src={currentCase.afterImg} 
              alt="After treatment result" 
              className="slider-img img-after" 
            />
            <span className="slider-label label-after">AFTER CLINICAL</span>

            {/* Before Image (Clipped by sliderPos %) */}
            <div 
              className="slider-before-clipper" 
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img 
                src={currentCase.beforeImg} 
                alt="Before treatment" 
                className="slider-img img-before" 
              />
              <span className="slider-label label-before">BASELINE BEFORE</span>
            </div>

            {/* Draggable Divider Line & Handle */}
            <div 
              className="slider-divider-line" 
              style={{ left: `${sliderPos}%` }}
            >
              <div className="slider-thumb-handle">
                <ArrowLeftRight size={16} />
              </div>
            </div>

            {/* Native range input for accessible touch/mouse drag */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPos} 
              onChange={handleSliderChange}
              className="slider-native-input"
              aria-label="Drag slider to compare before and after clinical images"
            />
          </div>

          {/* Case Study Details Info */}
          <div className="case-study-meta">
            <div className="meta-header">
              <span className="meta-treatment-badge">{currentCase.treatment}</span>
              <h3 className="meta-title">{currentCase.title}</h3>
            </div>

            <div className="meta-grid">
              <div className="meta-item">
                <span className="meta-label">Patient Profile:</span>
                <span className="meta-val">{currentCase.patient}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Outcome Interval:</span>
                <span className="meta-val">{currentCase.timeframe}</span>
              </div>
            </div>

            <p className="meta-notes">
              <strong>Clinical Assessment:</strong> {currentCase.notes}
            </p>

            <button 
              onClick={onOpenBooking} 
              className="btn btn-primary case-book-btn"
            >
              <span>Consult On Similar Protocol</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
