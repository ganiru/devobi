// @ts-nocheck Transitional conversion: preserve the existing component API.
import React from 'react';
import { Sparkles, Check, Crown, ArrowRight } from 'lucide-react';

const TIERS = [
  {
    id: 'glow',
    name: 'Aura Glow',
    price: '$249',
    period: '/ month',
    tagline: 'Foundational Skin Health & Maintenance',
    features: [
      '1 Monthly Deluxe HydraFacial or Chemical Peel',
      '10% Off All Neurotoxins & Dermal Fillers',
      'Complimentary LED Red-Light Sessions',
      '10% Off Medical-Grade Skincare (SkinCeuticals, ZO)',
      'Quarterly VISIA 3D Digital Skin Scans'
    ],
    highlight: false,
    cta: 'Join Aura Glow'
  },
  {
    id: 'radiant',
    name: 'Radiant Elite',
    price: '$495',
    period: '/ month',
    tagline: 'Comprehensive Cellular Rejuvenation',
    features: [
      'Choice of Monthly Platinum HydraFacial OR Clear+Brilliant Laser',
      '15% Off All Injectables & Morpheus8 RF',
      '1 Complimentary B12 / Glutathione Longevity Booster monthly',
      'Priority VIP Scheduling with Medical Director',
      'Annual $250 Aesthetic Credit towards Fillers',
      'Invitations to Private Longevity Speaker Dinners'
    ],
    highlight: true,
    badge: 'MOST COVETED',
    cta: 'Apply for Elite'
  },
  {
    id: 'longevity',
    name: 'Platinum Longevity',
    price: '$990',
    period: '/ month',
    tagline: 'The Ultimate Full-Spectrum Regenerative Suite',
    features: [
      'Unlimited Medical Facials & Peels',
      '2 Annual Morpheus8 RF or BBL Hero Sessions Included',
      'Monthly High-Dose NAD+ Longevity IV Infusion',
      '20% Off All Injectable Balancing Protocols',
      'Dedicated Concierge Practitioner & Private Suite Access',
      'Complimentary Annual Epigenetic Biological Age Test'
    ],
    highlight: false,
    cta: 'Inquire for Platinum'
  }
];

export default function Memberships({ onOpenBooking }) {
  return (
    <section id="memberships" className="memberships-section">
      <div className="section-container">
        
        <div className="section-header-center">
          <div className="section-tag">
            <Crown size={14} />
            <span>VIP Longevity Club</span>
          </div>
          <h2 className="section-title">
            Curated Memberships for <span className="text-gold-gradient">Continuous Vitality</span>
          </h2>
          <p className="section-desc">
            Sustained regenerative aesthetics yield compound dividends. Enjoy preferential rates, 
            exclusive physician access, and seamless monthly rejuvenation rituals.
          </p>
        </div>

        <div className="memberships-grid">
          {TIERS.map((t) => (
            <div 
              key={t.id} 
              className={`membership-card glass-panel ${t.highlight ? 'featured-card' : ''}`}
            >
              {t.badge && (
                <div className="tier-badge">{t.badge}</div>
              )}

              <div className="tier-header">
                <h3 className="tier-name">{t.name}</h3>
                <p className="tier-tagline">{t.tagline}</p>
                <div className="tier-price-row">
                  <span className="tier-price">{t.price}</span>
                  <span className="tier-period">{t.period}</span>
                </div>
              </div>

              <div className="tier-divider"></div>

              <ul className="tier-features-list">
                {t.features.map((f, i) => (
                  <li key={i} className="tier-feature-item">
                    <Check size={16} className="feature-check" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={onOpenBooking} 
                className={`btn w-full ${t.highlight ? 'btn-primary' : 'btn-secondary'}`}
              >
                <span>{t.cta}</span>
                <ArrowRight size={15} />
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
