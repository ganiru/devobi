// @ts-nocheck Transitional conversion: preserve the existing component API.
import React from 'react';
import { MapPin, Phone, Mail, Sparkles, ArrowRight, Shield } from 'lucide-react';

export default function Footer({ onOpenVoice, onOpenBooking }) {
  return (
    <footer className="footer-wrapper">
      <div className="section-container">
        
        {/* Main Footer Grid */}
        <div className="footer-top-grid">
          
          {/* Col 1: Brand & Voice Agent Spotlight */}
          <div className="footer-brand-col">
            <div className="brand-logo">
              <div className="brand-monogram">É</div>
              <div className="brand-text">
                <span className="brand-name">ÉLÉVATION</span>
                <span className="brand-subtitle">MEDSPA & LONGEVITY</span>
              </div>
            </div>
            <p className="footer-bio">
              The premier synthesis of surgical-grade aesthetic artistry, advanced photo-lasers, 
              and cellular rejuvenation. Directed by double board-certified physicians.
            </p>
            <div className="footer-voice-cta glass-panel">
              <Sparkles size={16} className="text-gold" />
              <div>
                <strong>Aura Voice AI Assistant</strong>
                <p>Instant answers on downtime & protocols.</p>
              </div>
              <button 
                onClick={onOpenVoice} 
                className="btn-footer-voice"
                aria-label="Open Aura Voice AI Assistant"
              >
                Launch Voice
              </button>
            </div>
          </div>

          {/* Col 2: Beverly Hills Pavilion */}
          <div className="footer-col">
            <h4 className="footer-col-title">Beverly Hills Pavilion</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={15} className="text-gold" />
                <span>9680 Wilshire Boulevard<br />Beverly Hills, CA 90212</span>
              </li>
              <li>
                <Phone size={15} className="text-gold" />
                <span>(310) 882-9100</span>
              </li>
              <li>
                <Mail size={15} className="text-gold" />
                <span>beverlyhills@elevationmedspa.com</span>
              </li>
              <li className="valet-note">Private underground valet available</li>
            </ul>
          </div>

          {/* Col 3: Manhattan Pavilion */}
          <div className="footer-col">
            <h4 className="footer-col-title">Manhattan Pavilion</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={15} className="text-gold" />
                <span>740 Madison Avenue, 4th Fl<br />New York, NY 10065</span>
              </li>
              <li>
                <Phone size={15} className="text-gold" />
                <span>(212) 584-3300</span>
              </li>
              <li>
                <Mail size={15} className="text-gold" />
                <span>madison@elevationmedspa.com</span>
              </li>
              <li className="valet-note">Private elevator access on 64th St</li>
            </ul>
          </div>

          {/* Col 4: Hours & VIP Concierge */}
          <div className="footer-col">
            <h4 className="footer-col-title">Pavilion Hours</h4>
            <ul className="footer-hours-list">
              <li>
                <span>Monday – Friday:</span>
                <strong>9:00 AM – 7:00 PM</strong>
              </li>
              <li>
                <span>Saturday:</span>
                <strong>10:00 AM – 6:00 PM</strong>
              </li>
              <li>
                <span>Sunday:</span>
                <span className="text-muted">Private Surgeries Only</span>
              </li>
            </ul>

            <div className="footer-newsletter">
              <span className="newsletter-label">VIP Private Access List</span>
              <div className="newsletter-input-wrap">
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                <button 
                  type="button" 
                  className="newsletter-btn"
                  aria-label="Subscribe to VIP newsletter"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Legal & Medical Disclaimer */}
        <div className="footer-disclaimer-box">
          <p className="disclaimer-text">
            <strong>Medical Notice:</strong> The information provided on this site is for educational 
            and illustrative purposes only and is not intended as medical advice. Every patient possesses 
            distinct anatomical characteristics; results may vary. All surgical consultations, 
            prescriptive neurotoxins, lasers, and dermal fillers are conducted by or under direct 
            supervision of board-certified physicians.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} ÉLÉVATION MedSpa & Longevity Institute. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">HIPAA Compliance</a>
            <span>•</span>
            <a href="#">Terms of Concierge Care</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
