import React from 'react';
import { BadgeCheck, ShieldCheck, Award, Zap } from 'lucide-react';

export default function BeforeAfter() {
  return (
    <section className="beforeafter-section" id="service-details">
      <div className="section-container">
        <span className="section-tag"><ShieldCheck size={14} /> Our Guarantee</span>
        <h2 className="section-heading">Service Guarantee & Excellence</h2>
        <p className="section-desc">
          We back every job with real commitments — licensed plumbers, upfront pricing, and a
          satisfaction guarantee that means we won't leave until you're happy.
        </p>

        <div className="comparison-wrapper glass-panel" style={{ marginTop: '36px' }}>
          <div className="comparison-card left">
            <BadgeCheck className="icon-light" size={36} />
            <h3 className="left-title">Our Promise to You</h3>

            <ul className="left-list">
              <li><strong>Licensed & Insured:</strong> Full liability insurance and proper licensing for your peace of mind.</li>
              <li><strong>Upfront Pricing:</strong> Clear estimates with no hidden fees before any work begins.</li>
              <li><strong>Clean Work:</strong> We protect your home and leave the area spotless after repairs.</li>
              <li><strong>Satisfaction Guaranteed:</strong> We don't leave until you're satisfied with the repair or installation.</li>
              <li><strong>Emergency Backup:</strong> 24/7 dispatch team on standby for urgent situations.</li>
            </ul>
          </div>

          <div className="comparison-card right">
            <Zap className="icon" size={36} />
            <h3 className="right-title">Service Excellence</h3>

            <div className="stat-row">
              <div className="stat-item">
                <span className="stat-number">5,000+</span>
                <span className="stat-label">Residential Repairs Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">300+</span>
                <span className="stat-label">Commercial Accounts Served</span>
              </div>
            </div>

            <div className="guarantee-badge">
              <Award size={18} />
              <strong>Certified Plumbing Experts</strong>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
