// @ts-nocheck Transitional conversion: preserve the existing component API.
import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, CheckCircle, Sparkles } from 'lucide-react';
import { bookConsultation } from '../../services/crmService';

const TIME_SLOTS = [
  '09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'
];

export default function BookingModal({ isOpen, onClose, defaultService = '' }) {
  const [service, setService] = useState(defaultService || 'General Plumbing Service');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00 AM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultService) setService(defaultService);
  }, [defaultService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsBooking(true);

    try {
      const scheduledDate = date || new Date().toISOString().slice(0, 10);
      await bookConsultation({
        name,
        phone,
        email,
        preferredDate: scheduledDate,
        preferredTime: time,
        notes: service
      });
      setIsSubmitted(true);
    } catch (err) {
      setError('Something went wrong booking your service. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="voice-modal-overlay">
      <div className="voice-dock-container glass-panel animate-fade-in" role="dialog" aria-modal="true"
        style={{ maxWidth: '480px', height: 'auto', maxHeight: '92vh' }}>

        {/* Header */}
        <div className="voice-dock-header">
          <div className="voice-dock-title-group">
            <div className="aura-avatar-glow">
              <Calendar className="aura-sparkle-icon" size={18} />
            </div>
            <div>
              <h3 className="aura-name">Schedule Service</h3>
              <p className="aura-status-subtext">
                <span className="status-dot connecting"></span>
                {isSubmitted ? 'Appointment Confirmed' : 'Same-day service available'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="icon-btn close-btn" aria-label="Close booking modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="booking-form" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Service Type
              </label>
              <select value={service} onChange={(e) => setService(e.target.value)} className="config-select" required>
                <option>Emergency Repair</option>
                <option>Drain Cleaning & Clog Removal</option>
                <option>Water Heater Service</option>
                <option>Pipe Replacement & Repair</option>
                <option>Sewer Line Inspection & Repair</option>
                <option>Toilet & Fixture Repair</option>
                <option>General Plumbing Service</option>
              </select>
            </div>

            <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <Calendar size={12} /> Date
                </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="config-input" required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Time
                </label>
                <select value={time} onChange={(e) => setTime(e.target.value)} className="config-select">
                  {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="config-input" placeholder="John Smith" required />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="config-input" placeholder="(555) 123-4567" required />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="config-input" placeholder="john@example.com" required />
            </div>

            {error && <p style={{ color: '#ff6b6b', fontSize: '0.82rem' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isBooking}>
                {isBooking ? 'Booking...' : <><Calendar size={16} /> Confirm</>}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
              <CheckCircle size={56} style={{ color: '#22C55E' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '10px' }}>Service Confirmed!</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
              Thank you, {name}. Our dispatch team has your service request
              {service ? ` for ${service}` : ''} and will confirm shortly.
            </p>
            <button onClick={handleReset} className="btn btn-primary">
              <Sparkles size={16} /> Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}