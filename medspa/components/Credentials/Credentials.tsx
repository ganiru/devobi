import React from 'react';
import { Sparkles, Shield, Award, CheckCircle, Star, Quote } from 'lucide-react';

const TEAM = [
  {
    name: 'Dr. Julian Vance, MD, FACS',
    role: 'Founder & Medical Director',
    credentials: 'Double Board-Certified Facial Plastic & Reconstructive Surgeon',
    bio: 'Pioneer of micro-structural facial vectoring with over 18 years of clinical leadership in Beverly Hills and Zurich.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Elena Rostova, MPAS, PA-C',
    role: 'Clinical Director & Master Injector',
    credentials: 'National Allergan & Galderma Aesthetic Trainer',
    bio: 'Renowned for undetectable lip balancing and natural anatomical rejuvenation. Lecturer on vascular safety in aesthetics.',
    image: 'https://images.unsplash.com/photo-1594824813581-2292f7e71618?auto=format&fit=crop&w=600&q=80'
  }
];

const REVIEWS = [
  {
    quote: "The combination of medical rigor and pure luxury at ÉLÉVATION is unmatched. Morpheus8 with Dr. Vance took years off my lower face with virtually no discomfort.",
    author: "Caroline V. — Beverly Hills, CA",
    treatment: "Morpheus8 & Nefertiti Lift"
  },
  {
    quote: "Elena is an absolute artist with fillers. No one can tell I had anything done—they just keep asking if I just came back from a 3-week wellness retreat in Switzerland.",
    author: "Serena M. — Manhattan, NY",
    treatment: "Micro-Droplet Lip & Malar Balancing"
  }
];

export default function Credentials() {
  return (
    <section id="credentials" className="credentials-section">
      <div className="section-container">
        
        <div className="section-header-center">
          <div className="section-tag">
            <Shield size={14} />
            <span>Physician Oversight</span>
          </div>
          <h2 className="section-title">
            World-Class Medical Leadership & <span className="text-gold-gradient">Safety Standards</span>
          </h2>
          <p className="section-desc">
            We reject cookie-cutter med spa trends. Every treatment at ÉLÉVATION is designed 
            around your cranial and facial anatomy by board-certified practitioners.
          </p>
        </div>

        {/* Specialists Team Grid */}
        <div className="team-grid">
          {TEAM.map((member, i) => (
            <div key={i} className="team-card glass-panel">
              <div className="team-img-wrap">
                <img src={member.image} alt={member.name} className="team-img" />
                <div className="team-img-overlay"></div>
              </div>
              <div className="team-info">
                <span className="team-role-tag">{member.role}</span>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-credentials">{member.credentials}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Safety Badges */}
        <div className="safety-badges-bar glass-panel">
          <div className="safety-badge-item">
            <Award className="safety-icon" />
            <div>
              <strong>FDA-Cleared Only</strong>
              <span>Sciton, InMode & Allergan platforms</span>
            </div>
          </div>
          <div className="safety-badge-item">
            <Shield className="safety-icon" />
            <div>
              <strong>Hospital-Grade Cleanliness</strong>
              <span>Class-A sterile treatment suites</span>
            </div>
          </div>
          <div className="safety-badge-item">
            <CheckCircle className="safety-icon" />
            <div>
              <strong>3D VISIA Complexion Analysis</strong>
              <span>Subsurface UV and pigment mapping</span>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="testimonials-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card glass-panel">
              <div className="review-stars">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={15} fill="#C5A880" color="#C5A880" />
                ))}
              </div>
              <p className="review-quote">"{r.quote}"</p>
              <div className="review-author-row">
                <div>
                  <strong className="review-author">{r.author}</strong>
                  <span className="review-treatment-tag">{r.treatment}</span>
                </div>
                <Quote size={24} className="review-quote-icon" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
