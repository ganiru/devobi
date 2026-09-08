// @ts-nocheck Transitional conversion: preserve the existing component API.
import React from 'react';
import { Sparkles, Calendar, ShieldCheck, Star, Mic, ArrowUpRight } from 'lucide-react';

export default function Hero({ onOpenVoice, onOpenBooking }) {
  return (
    <section className="hero-section">
      <div className="section-container hero-container">
        
        {/* Left Column: Editorial & Voice AI Entry */}
        <div className="hero-content">
          <div className="section-tag animate-float">
            <Sparkles />
            <span>Beverly Hills • Manhattan Flagship</span>
          </div>

          <h1 className="hero-title">
            The Pinnacle of <br />
            <span className="text-gold-gradient">Regenerative Aesthetics</span> <br />
            & Longevity.
          </h1>

          <p className="hero-desc">
            Bespoke facial balancing, medical-grade skin remodeling, and cellular longevity 
            therapies overseen by board-certified aesthetic physicians. Natural, timeless, 
            undeniably elevated.
          </p>

          {/* Voice AI Interactive Hero Card */}
          <div className="voice-hero-card glass-panel">
            <div className="voice-card-header">
              <div className="voice-status-indicator">
                <span className="pulse-ping"></span>
                <span className="pulse-core"></span>
              </div>
              <span className="voice-card-label">Voice AI Clinical Concierge</span>
            </div>

            <p className="voice-card-prompt">
              "Hi, I'm Aura. Have a question about downtime, candidacy, or our protocols? Tap below to speak."
            </p>

            <div className="voice-card-chips">
              <button 
                onClick={onOpenVoice}
                className="voice-chip-btn"
              >
                <Mic size={13} className="text-gold" />
                <span>"Am I a candidate for Morpheus8?"</span>
              </button>
              <button 
                onClick={onOpenVoice}
                className="voice-chip-btn"
              >
                <Mic size={13} className="text-gold" />
                <span>"What's the downtime for Botox?"</span>
              </button>
            </div>

            <button 
              onClick={onOpenVoice} 
              className="voice-card-cta"
              id="hero-talk-aura-btn"
            >
              <Sparkles size={16} />
              <span>Speak with Aura Now</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Primary CTA Group */}
          <div className="hero-cta-group">
            <button 
              onClick={onOpenBooking} 
              className="btn btn-primary hero-btn"
              id="hero-book-btn"
            >
              <Calendar size={18} />
              <span>Reserve Private Consultation</span>
            </button>
            <a href="#treatments" className="btn btn-secondary hero-btn">
              <span>Explore Treatments</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="hero-trust-metrics">
            <div className="metric-item">
              <span className="metric-num">15,000+</span>
              <span className="metric-label">Procedures Completed</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-num">100%</span>
              <span className="metric-label">Board-Certified Specialists</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <div className="metric-rating">
                <span className="metric-num">4.99</span>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#C5A880" color="#C5A880" />
                  ))}
                </div>
              </div>
              <span className="metric-label">Over 1,200 Verified Reviews</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="hero-visual-wrapper">
          <div className="hero-image-frame">
            <img 
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80" 
              alt="Luxury MedSpa Treatment Suite" 
              className="hero-main-img"
            />
            <div className="hero-img-gradient-overlay"></div>

            {/* Floating High-End Feature Badges */}
            <div className="hero-floating-badge badge-top-right glass-panel">
              <ShieldCheck size={20} className="text-gold" />
              <div>
                <strong>FDA-Cleared Tech</strong>
                <p>Sciton BBL • Morpheus8 • Sofwave</p>
              </div>
            </div>

            <div className="hero-floating-badge badge-bottom-left glass-panel">
              <div className="badge-avatar-stack">
                <span className="avatar-pill">MD</span>
                <span className="avatar-pill">DO</span>
                <span className="avatar-pill">PA</span>
              </div>
              <div>
                <strong>Master Injectors</strong>
                <p>Facial Anatomy Specialists</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
