import React from 'react';
import { Wrench, Phone, Calendar } from 'lucide-react';

export default function Navbar({ onOpenBooking }) {
  return (
    <nav className="navbar">
      <div className="section-container nav-wrapper">
        {/* Logo / Brand */}
        <a href="/plumber" className="nav-logo">
          <Wrench size={28} className="text-blue" />
          <span><span className="brand-accent">Joe's</span> Reliable Plumbing</span>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li><a href="#services" className="nav-link">Services</a></li>
          <li><a href="#service-details" className="nav-link">Guarantee</a></li>
          <li><a href="tel:1-555-PLUMBING" className="nav-link">Contact</a></li>
        </ul>

        {/* CTA Buttons */}
        <div className="nav-actions">
          <a href="tel:1-555-PLUMBING" className="btn nav-call-btn">
            <Phone size={18} />
            <span>(555) 247-5346</span>
          </a>

          <button onClick={onOpenBooking} className="btn btn-primary" style={{ padding: '0.8rem 1.4rem', fontSize: '0.92rem' }}>
            <Calendar size={17} />
            <span>Get a Quote</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
