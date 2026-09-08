// @ts-nocheck Transitional conversion: preserve the existing component API.
import React, { useState } from 'react';
import { Sparkles, Clock, Calendar, ArrowRight, Mic, CheckCircle2 } from 'lucide-react';
import voiceAgent from '../../services/voiceAgentService';

const TREATMENTS_DATA = [
  {
    id: 'morpheus8',
    category: 'lasers',
    title: 'Morpheus8 RF Microneedling',
    subtitle: 'Deep Subdermal Collagen Remodeling & Skin Tightening',
    description: 'Combines microneedling with targeted fractional radiofrequency energy to remodel collagen, sculpt jawline contours, and smooth deep texture.',
    duration: '60 - 90 min',
    downtime: '1 - 2 days mild pinkness',
    price: 'From $950 / session',
    image: 'https://images.unsplash.com/photo-1512290900672-1f02e71dfb3f?auto=format&fit=crop&w=800&q=80',
    concerns: ['Skin Laxity', 'Jawline Definition', 'Acne Scars', 'Fine Lines'],
    voicePrompt: 'What should I expect during and after a Morpheus8 session?'
  },
  {
    id: 'botox-dysport',
    category: 'injectables',
    title: 'Precision Neurotoxins (Botox & Dysport)',
    subtitle: 'Micro-Targeted Expression Softening',
    description: 'Artfully dosed micro-injections that preserve authentic facial expression while eliminating forehead lines, crow’s feet, and frown furrows.',
    duration: '20 - 30 min',
    downtime: 'Zero downtime',
    price: 'From $16 / unit',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    concerns: ['Forehead Lines', "Crow's Feet", 'Gummy Smile', 'TMJ / Jaw Slimming'],
    voicePrompt: 'Does Botox look stiff or natural at your medspa?'
  },
  {
    id: 'hydrafacial-platinum',
    category: 'facials',
    title: 'Platinum HydraFacial Deluxe',
    subtitle: '6-Step Vortex Lymphatic & Peptide Infusion',
    description: 'Medical extraction, gentle fruit-acid peel, lymphatic drainage, and custom peptide boosters followed by soothing medical LED light therapy.',
    duration: '60 min',
    downtime: 'Instant red-carpet glow',
    price: '$375',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    concerns: ['Congested Pores', 'Dull Skin', 'Dehydration', 'Hyperpigmentation'],
    voicePrompt: 'Why is Platinum Hydrafacial different from regular facials?'
  },
  {
    id: 'dermal-fillers',
    category: 'injectables',
    title: 'Architectural Dermal Balancing',
    subtitle: 'Restylane & Juvéderm Hyaluronic Fillers',
    description: 'Restores midface volume, enhances lip contour, and defines chin projection using cross-linked hyaluronic gels tailored to individual facial anatomy.',
    duration: '45 - 60 min',
    downtime: 'Minor swelling (24-48 hrs)',
    price: 'From $850 / syringe',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    concerns: ['Lip Volume', 'Under-Eye Hollows', 'Cheek Definition', 'Marionette Lines'],
    voicePrompt: 'How natural do dermal fillers look when done at ÉLÉVATION?'
  },
  {
    id: 'bbl-hero-laser',
    category: 'lasers',
    title: 'Sciton BBL Hero & Halo Hybrid',
    subtitle: 'Genetic Photo-Rejuvenation & Sun Damage Eradication',
    description: 'World’s most potent pulsed light therapy, scientifically proven to reverse cellular aging, erase brown spots, broken capillaries, and redness.',
    duration: '45 min',
    downtime: '1 - 3 days mild flaking',
    price: 'From $750',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
    concerns: ['Sun Spots', 'Rosacea', 'Broken Capillaries', 'Crepey Texture'],
    voicePrompt: 'How many BBL Hero sessions are recommended for sun damage?'
  },
  {
    id: 'nad-longevity-iv',
    category: 'longevity',
    title: 'NAD+ Cellular Longevity Infusion',
    subtitle: 'Mitochondrial Repair & Cognitive Vitality',
    description: 'Direct intravenous delivery of high-dose Nicotinamide Adenine Dinucleotide (NAD+) combined with glutathione and B-complex to supercharge DNA repair.',
    duration: '90 - 120 min',
    downtime: 'Zero (Immediate mental clarity)',
    price: 'From $450',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    concerns: ['Fatigue', 'Cellular Aging', 'Brain Fog', 'Athletic Recovery'],
    voicePrompt: 'What are the anti-aging benefits of NAD+ IV drip?'
  }
];

export default function Treatments({ onOpenVoice, onSelectTreatmentForBooking }) {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' 
    ? TREATMENTS_DATA 
    : TREATMENTS_DATA.filter(t => t.category === activeTab);

  const handleAskAura = (prompt) => {
    voiceAgent.handleUserVoiceInput(prompt);
    onOpenVoice();
  };

  return (
    <section id="treatments" className="treatments-section">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-tag">
            <Sparkles />
            <span>Clinical Treatments</span>
          </div>
          <h2 className="section-title">
            Artistry Driven by <span className="text-gold-gradient">Clinical Precision</span>
          </h2>
          <p className="section-desc">
            Every procedure is performed in our surgical-grade aesthetic suites using 
            FDA-cleared innovations and physician oversight.
          </p>

          {/* Filter Categories */}
          <div className="treatment-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Protocols
            </button>
            <button 
              className={`tab-btn ${activeTab === 'injectables' ? 'active' : ''}`}
              onClick={() => setActiveTab('injectables')}
            >
              Injectables
            </button>
            <button 
              className={`tab-btn ${activeTab === 'lasers' ? 'active' : ''}`}
              onClick={() => setActiveTab('lasers')}
            >
              Lasers & RF Tightening
            </button>
            <button 
              className={`tab-btn ${activeTab === 'facials' ? 'active' : ''}`}
              onClick={() => setActiveTab('facials')}
            >
              Medical Facials
            </button>
            <button 
              className={`tab-btn ${activeTab === 'longevity' ? 'active' : ''}`}
              onClick={() => setActiveTab('longevity')}
            >
              Longevity & IV
            </button>
          </div>
        </div>

        {/* Treatment Grid */}
        <div className="treatments-grid">
          {filtered.map((item) => (
            <div key={item.id} className="treatment-card glass-panel">
              
              <div className="card-media-wrap">
                <img src={item.image} alt={item.title} className="treatment-card-img" />
                <div className="card-price-badge">{item.price}</div>
              </div>

              <div className="treatment-card-body">
                <span className="treatment-subtitle">{item.subtitle}</span>
                <h3 className="treatment-title">{item.title}</h3>
                <p className="treatment-desc">{item.description}</p>

                {/* Treatment Details Pills */}
                <div className="treatment-specs">
                  <div className="spec-pill">
                    <Clock size={13} className="text-gold" />
                    <span>{item.duration}</span>
                  </div>
                  <div className="spec-pill">
                    <span className="dot-sage"></span>
                    <span>{item.downtime}</span>
                  </div>
                </div>

                {/* Concerns Tags */}
                <div className="concerns-tags">
                  {item.concerns.map((c, i) => (
                    <span key={i} className="concern-tag">
                      <CheckCircle2 size={11} className="text-gold" />
                      {c}
                    </span>
                  ))}
                </div>

                {/* Voice & Booking CTA Bar */}
                <div className="card-footer-actions">
                  <button 
                    onClick={() => handleAskAura(item.voicePrompt)}
                    className="btn-ask-aura"
                    title="Ask Aura AI about this treatment"
                  >
                    <Mic size={14} className="text-gold" />
                    <span>Ask Aura</span>
                  </button>

                  <button 
                    onClick={() => onSelectTreatmentForBooking(item.title)}
                    className="btn-book-card"
                  >
                    <span>Book Protocol</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
