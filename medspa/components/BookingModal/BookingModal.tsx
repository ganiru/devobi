// @ts-nocheck Transitional conversion: preserve the existing component API.
import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const TIME_SLOTS = [
  '09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'
];

export default function BookingModal({ isOpen, onClose, defaultTreatment = '' }) {
  const [treatment, setTreatment] = useState(defaultTreatment || 'Comprehensive VISIA Aesthetic Consultation');
  const [location, setLocation] = useState('beverly-hills');
  const [practitioner, setPractitioner] = useState('any');
  const [date, setDate] = useState('2026-09-15');
  const [time, setTime] = useState('11:00 AM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync default treatment if passed
  React.useEffect(() => {
    if (defaultTreatment) {
      setTreatment(defaultTreatment);
    }
  }, [defaultTreatment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Fire celebratory luxury gold confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A880', '#E7D5BA', '#9A7B54', '#FAF8F5']
      });
    } catch (_) {}
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-panel glass-panel animate-fade-in" role="dialog" aria-modal="true">
        
        {/* Header */}
        <div className="booking-modal-header">
          <div className="booking-header-title">
            <span className="booking-tag">Private Concierge</span>
            <h3 className="booking-heading">Reserve Your Private Consultation</h3>
          </div>
          <button 
            id="btn-close-booking"
            onClick={onClose} 
            className="icon-btn close-btn"
            aria-label="Close booking modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="booking-form">
            
            {/* Treatment Picker */}
            <div className="form-group">
              <label className="form-label">Selected Protocol / Service</label>
              <select 
                value={treatment} 
                onChange={(e) => setTreatment(e.target.value)}
                className="form-select"
                required
              >
                <option value="Comprehensive VISIA Aesthetic Consultation">Comprehensive VISIA Aesthetic Consultation</option>
                <option value="Morpheus8 RF Microneedling">Morpheus8 RF Microneedling</option>
                <option value="Precision Neurotoxins (Botox & Dysport)">Precision Neurotoxins (Botox & Dysport)</option>
                <option value="Platinum HydraFacial Deluxe">Platinum HydraFacial Deluxe</option>
                <option value="Architectural Dermal Balancing">Architectural Dermal Balancing</option>
                <option value="Sciton BBL Hero & Halo Hybrid">Sciton BBL Hero & Halo Hybrid</option>
                <option value="NAD+ Cellular Longevity Infusion">NAD+ Cellular Longevity Infusion</option>
              </select>
            </div>

            {/* Location & Practitioner */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label"><MapPin size={13} /> Pavilion Location</label>
                <select 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-select"
                >
                  <option value="beverly-hills">Beverly Hills (Rodeo Dr)</option>
                  <option value="manhattan">Manhattan (Madison Ave)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label"><User size={13} /> Preferred Clinician</label>
                <select 
                  value={practitioner} 
                  onChange={(e) => setPractitioner(e.target.value)}
                  className="form-select"
                >
                  <option value="any">First Available Board-Certified Specialist</option>
                  <option value="dr-vance">Dr. Julian Vance, MD (Medical Director)</option>
                  <option value="elena-rostova">Elena Rostova, PA-C (Master Injector)</option>
                </select>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="form-group">
              <label className="form-label"><Calendar size={13} /> Select Date</label>
              <input 
                type="date" 
                value={date} 
                min="2026-09-06"
                onChange={(e) => setDate(e.target.value)}
                className="form-input" 
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Clock size={13} /> Select Arrival Window</label>
              <div className="time-slots-grid">
                {TIME_SLOTS.map((t) => (
                  <button 
                    key={t}
                    type="button"
                    className={`time-slot-pill ${time === t ? 'active' : ''}`}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Contact Info */}
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Eleanor Sinclair"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input" 
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. eleanor@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input" 
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input 
                  type="tel" 
                  placeholder="e.g. (310) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input" 
                  required
                />
              </div>
            </div>

            {/* Footer Submit */}
            <div className="booking-form-footer">
              <p className="privacy-note">
                Strict medical privacy observed (HIPAA compliant). A consultation coordinator will confirm your appointment via phone.
              </p>
              <button 
                type="submit" 
                id="btn-submit-booking"
                className="btn btn-primary w-full"
              >
                <span>Confirm Private Reservation</span>
              </button>
            </div>

          </form>
        ) : (
          /* Confirmation State */
          <div className="booking-confirmation-view">
            <div className="confirmation-icon-wrap">
              <CheckCircle size={44} className="text-gold" />
            </div>
            
            <h3 className="confirmation-title">Reservation Requested</h3>
            <p className="confirmation-desc">
              Thank you, <strong>{name || 'Valued Patient'}</strong>. We have reserved your provisional consultation slot for <strong>{treatment}</strong> on <strong>{date}</strong> at <strong>{time}</strong>.
            </p>

            <div className="confirmation-meta-card glass-panel">
              <div className="confirm-row">
                <span>Location:</span>
                <strong>{location === 'beverly-hills' ? 'Beverly Hills Pavilion' : 'Manhattan Pavilion'}</strong>
              </div>
              <div className="confirm-row">
                <span>Reservation ID:</span>
                <code>ELV-{Math.floor(100000 + Math.random() * 900000)}</code>
              </div>
              <div className="confirm-row">
                <span>Confirmation Sent To:</span>
                <span>{email || 'Your email address'}</span>
              </div>
            </div>

            <button 
              onClick={handleReset} 
              className="btn btn-primary"
            >
              Return to Pavilion Overview
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
