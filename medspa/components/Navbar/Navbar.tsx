// @ts-nocheck Transitional conversion: preserve the existing component API.
import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, Calendar, Menu, X, Compass } from 'lucide-react';

export default function Navbar({ onOpenVoice, onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="section-container navbar-container">
        
        {/* Brand Logo */}
        <a href="#" className="brand-logo" aria-label="ÉLÉVATION MedSpa Home">
          <div className="brand-monogram">É</div>
          <div className="brand-text">
            <span className="brand-name">ÉLÉVATION</span>
            <span className="brand-subtitle">MEDSPA & LONGEVITY</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <a href="#treatments" className="nav-link">Treatments</a>
          <a href="#before-after" className="nav-link">Transformations</a>
          <a href="#quiz" className="nav-link">AI Skin Matcher</a>
          <a href="#memberships" className="nav-link">Memberships</a>
          <a href="#credentials" className="nav-link">Our Specialists</a>
        </nav>

        {/* Right CTA Group */}
        <div className="navbar-actions">
          <button 
            onClick={onOpenVoice} 
            className="btn-voice-pill voice-nav-pill"
            id="nav-btn-voice"
            title="Ask Aura AI Concierge"
          >
            <Sparkles size={14} className="sparkle-gold" />
            <span>Aura AI</span>
          </button>

          <button 
            onClick={onOpenBooking} 
            className="btn btn-primary nav-book-btn"
            id="nav-btn-book"
          >
            <Calendar size={15} />
            <span>Book Visit</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer glass-panel">
          <a href="#treatments" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Treatments</a>
          <a href="#before-after" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Transformations</a>
          <a href="#quiz" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">AI Skin Matcher</a>
          <a href="#memberships" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Memberships</a>
          <a href="#credentials" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Our Specialists</a>
          <div className="mobile-drawer-actions">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenVoice(); }} 
              className="btn btn-secondary w-full"
            >
              <Sparkles size={16} />
              <span>Talk to Aura Voice AI</span>
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }} 
              className="btn btn-primary w-full"
            >
              <Calendar size={16} />
              <span>Book Consultation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
