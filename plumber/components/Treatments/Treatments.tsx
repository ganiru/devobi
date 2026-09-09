// @ts-nocheck Transitional conversion: preserve the existing component API.
import React from 'react';
import { Wrench, Droplet, AlertTriangle, Thermometer, Gauge, Mic } from 'lucide-react';

export default function Treatments() {
  const services = [
    {
      title: "Emergency Leak Repair",
      description: "Rapid response for burst pipes and flooding. Our emergency crew guarantees dispatch within hours with same-day repair on most issues.",
      icon: <Wrench className="text-red" size={32} />,
      keywords: ["leak", "burst pipe", "flood", "emergency repair"]
    },
    {
      title: "Drain Cleaning & Clog Removal",
      description: "Professional drain clearing using hydro-jetting and camera inspections to remove stubborn blockages quickly without damaging your pipes.",
      icon: <Droplet className="text-blue" size={32} />,
      keywords: ["drain", "clogged", "blocked sink", "slow drain"]
    },
    {
      title: "Water Heater Service",
      description: "Complete water heater replacement, repair, and maintenance for both traditional tank-style and modern energy-efficient tankless systems.",
      icon: <Thermometer className="text-orange" size={32} />,
      keywords: ["water heater", "tankless", "heater repair", "hot water"]
    },
    {
      title: "Pipe Replacement & Repair",
      description: "Modern pipe upgrade solutions including copper, PEX, and PVC. Repipe aging systems that corroded or contain outdated materials like lead.",
      icon: <Gauge className="text-blue" size={32} />,
      keywords: ["pipe", "piping", "repiping", "old pipes"]
    },
    {
      title: "Sewer Line Inspection & Repair",
      description: "Camera-guided sewer diagnostics and trenchless repair technology to address roots, cracks, and blockages without extensive digging.",
      icon: <Wrench className="text-orange" size={32} />,
      keywords: ["sewer", "main line", "backup"]
    },
    {
      title: "Toilet & Fixture Repair",
      description: "Fix running toilets, replace fill valves, update fixtures, and install modern water-saving faucets and showerheads.",
      icon: <Droplet className="text-blue" size={32} />,
      keywords: ["toilet", "running", "tank repair"]
    }
  ];

  return (
    <section id="services" className="treatments-section">
      <div className="section-container treatments-container">
        <span className="section-tag"><Wrench size={14} /> Services</span>
        <h2 className="section-heading">Plumbing Services</h2>
        <p className="section-desc">
          From emergency leak repair to complete repiping, our licensed plumbers deliver
          same-day service with guaranteed workmanship across residential and commercial properties.
        </p>

        <div className="treatments-grid">
          {services.map((service, index) => (
            <article
              key={index}
              className={`treatment-card glass-panel ${index === 0 ? 'emergency' : ''}`}
              id={`treatment-${index * 77}`}
            >
              <div className="treatment-icon-wrapper">
                {service.icon}
              </div>

              <h3 className="treatment-title">{service.title}</h3>
              <p className="treatment-description">{service.description}</p>

              <div className="treatment-actions">
                <button
                  className="treatment-btn btn btn-small btn-secondary"
                  aria-label={`Get more about ${service.title}`}
                >
                  Learn More
                </button>
                <button
                  className="treatment-btn btn btn-small emergency-cta"
                  aria-label={`Ask Aura about ${service.title}`}
                >
                  <Mic size={14} /> Ask Aura
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Services overview card */}
        <div className="services-overview-grid glass-panel">
          <div className="service-overview-item">
            <Wrench size={24} className="text-blue" />
            <div>
              <strong>Residential Plumbing</strong>
              <p className="service-sub">{services.length} service categories for homeowners</p>
            </div>
          </div>

          <div className="service-overview-item">
            <Wrench size={24} className="text-orange" />
            <div>
              <strong>Commercial Services</strong>
              <p className="service-sub">Large scale plumbing systems and maintenance contracts</p>
            </div>
          </div>

          <div className="service-overview-item highlight">
            <AlertTriangle size={24} className="text-red" />
            <div>
              <strong>Emergency Dispatch</strong>
              <p className="service-sub">{services[0].title} available 24/7 for urgent needs</p>
            </div>
          </div>

          <div className="service-overview-item">
            <Thermometer size={24} className="text-orange" />
            <div>
              <strong>Premium Service Standards</strong>
              <p className="service-sub">Top-rated plumbers with guaranteed workmanship and satisfaction</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
