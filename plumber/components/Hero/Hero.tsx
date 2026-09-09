// @ts-nocheck Transitional conversion: preserve the existing component API.
import React, { useState } from 'react';
import { Sparkles, Calendar, Phone, MapPin, Star, Clock, ShieldCheck, Mic } from 'lucide-react';

export default function Hero({ onOpenVoice, onOpenBooking }) {
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(true);

  // Emergency service hours check
  const isEmergencyHours = () => {
    if (typeof window === 'undefined') return true;
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const hour = now.getHours() + now.getMinutes() / 60;

    // Emergency: any time (24/7 dispatch)
    if (day === 0 || day === 6 || hour < 6 || hour >= 22) {
      return true;
    }
    return false;
  };

  const emergencyHoursText = isEmergencyHours() 
    ? "Open 24/7 for Emergencies" 
    : "Business Hours: Mon-Fri 7am-6pm";

  return (
    <section className="hero-section">
      <div className="section-container hero-container">
        
        {/* Left Column: Branding & Voice AI Entry */}
        <div className="hero-content">
          {/* Trust Badge */}
          <div className="section-tag animate-float">
            <Sparkles />
            <span>America's #1 Trusted Plumber</span>
          </div>

          <h1 className="hero-title">
            Joe's Reliable <br />
            <span className="text-blue-gradient">Plumbing Services</span> & <br />
            Emergency Response.
          </h1>

          <p className="hero-desc">
            Professional plumbing solutions for residential and commercial properties. 
            From leak detection to complete pipe repiping, drain cleaning and emergency repairs.
            Same-day service commitment with experienced licensed plumbers ready to help you today.
          </p>

          {/* Voice AI Interactive Hero Card */}
          <div className="voice-hero-card glass-panel">
            <div className="voice-card-header">
              <div className="voice-status-indicator">
                <span className="pulse-ping"></span>
                <span className="pulse-core"></span>
              </div>
              <span className="voice-card-label">AI Plumbing Dispatch Expert</span>
            </div>

            <p className="voice-card-prompt">
              "I'm Aura, your plumbing AI expert. Need emergency repairs, drain cleaning, 
              or a service appointment? Tap below to speak or ask about our 24/7 dispatch."
            </p>

            <div className="voice-card-chips">
              <button 
                onClick={onOpenVoice}
                className="voice-chip-btn"
                title='Ask if urgent same-day service is available today'
              >
                <Mic size={13} className="text-blue" />
                <span>"Is emergency dispatch available?"</span>
              </button>
              <button 
                onClick={onOpenVoice}
                className="voice-chip-btn"
                title='Ask about drain cleaning service or pricing'
              >
                <Mic size={13} className="text-blue" />
                <span>"What do you charge for drain cleaning?"</span>
              </button>
            </div>

            <button 
              onClick={onOpenVoice} 
              className="voice-card-cta"
              id="hero-talk-aura-btn"
            >
              <Sparkles size={16} />
              <span>Speak with Aura Now</span>
              <ArrowUpRightIcon size={16} />
            </button>
          </div>

          {/* Primary CTA Group */}
          <div className="hero-cta-group">
            {showEmergencyBanner && (
              <div 
                className={`emergency-banner ${isEmergencyHours() ? 'visible' : ''}`}
                onClick={() => setShowEmergencyBanner(false)}
              >
                <span className="emergency-badge">{emergencyHoursText}</span>
                <span className="emergency-action">Tap to hide</span>
              </div>
            )}

            <button 
              onClick={onOpenBooking} 
              className="btn btn-primary hero-btn"
              id="hero-book-btn"
            >
              <Calendar size={18} />
              <span>Schedule Service Call</span>
            </button>
            <a href="#services" className="btn btn-secondary hero-btn">
              <span>View All Services</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="hero-trust-metrics">
            <div className="metric-item">
              <span className="metric-num">24/7</span>
              <span className="metric-label">Emergency Response Available</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-num">Licensed</span>
              <span className="metric-label">& Insured Plumbers</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-num">98.7%</span>
              <span className="metric-label">Customer Satisfaction Rating</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <div className="metric-rating">
                <span className="metric-num">4.97</span>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#0E4D92" color="#0E4D92" />
                  ))}
                </div>
              </div>
              <span className="metric-label">Over 8,500+ Verified Reviews</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="hero-visual-wrapper">
          <div className="hero-image-frame">
            <img 
              src="https://unsplash.com/photos/man-wearing-black-pullover-hoodie-holding-tool-NfG4rXmceFM?auto=format&fit=crop&w=1200&q=80" 
              alt="Professional plumbing service technician working" 
              className="hero-main-img"
            />
            <div className="hero-img-gradient-overlay"></div>

            {/* Floating Feature Badges */}
            <div className="hero-floating-badge badge-top-right glass-panel">
              <Clock size={20} className="text-blue" />
              <div>
                <strong>Punctual Arrivals</strong>
                <p>97% on-time for scheduled calls</p>
              </div>
            </div>

            <div className="hero-floating-badge badge-bottom-left glass-panel">
              <ShieldCheck size={20} className="text-orange" />
              <div>
                <strong>Fully Licensed & Insured</strong>
                <p>Every tech is background-checked</p>
              </div>
            </div>

            <div className="hero-floating-badge badge-bottom-right glass-panel">
              <MapPin size={20} className="text-orange" />
              <div>
                <strong>Serving Your Area</strong>
                <p>Residential & Commercial Services</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

// Icon components
const ArrowUpRightIcon = (props) => (
  <svg 
    {...props} 
    xmlns="http://www.w3.org/2000/svg"
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);
