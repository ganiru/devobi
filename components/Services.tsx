
import React from 'react';

const services = [
  {
    badge: "Speed-to-Lead",
    title: "24/7 AI Concierge",
    audience: "Agents · Brokers · Wholesalers",
    description: "Monitors your Zillow, Realtor.com, and Facebook leads and fires off a qualifying SMS conversation within seconds — day or night. By the time a competitor picks up the phone, your lead is already booked on your calendar.",
    icon: (
      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    badge: "Prospecting",
    title: "Ghost Lead Audit",
    audience: "Brokers · Wholesalers",
    description: "We scan a target agent's online presence and pinpoint every unanswered inquiry and slow follow-up. The result: a personalized report that opens doors with prospects who are clearly leaving money on the table.",
    icon: (
      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    badge: "Pipeline Automation",
    title: "Survey-to-CRM Intake",
    audience: "Agents · Brokers · Wholesalers",
    description: "Every inbound prospect is scored instantly, logged in your CRM, and pushed to you via instant mobile alerts — so you always know which leads are hot and ready to move, without touching a spreadsheet.",
    icon: (
      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  {
    badge: "ROI Recovery",
    title: "Database Re-activation",
    audience: "Agents · Brokers",
    description: "Stop letting old CRM leads gather dust. Our AI agents re-engage your cold database to identify who is back in the market, delivering 'ready to talk' prospects directly to your inbox without you lifting a finger.", icon: (
      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

const steps = [
  { number: "01", title: "Discovery Call", description: "We audit your current workflow and identify the biggest time-wasters costing you deals." },
  { number: "02", title: "Custom Build", description: "We build automations tailored to your CRM, lead sources, and communication style. No templates." },
  { number: "03", title: "Go Live in 2 Weeks", description: "Your system is live, tested, and running. We handle onboarding and stay on hand for support." },
];

const crms = ["Follow Up Boss", "LionDesk", "KvCORE", "Salesforce", "HubSpot", "Chime", "Sierra Interactive"];

const Services: React.FC = () => {
  return (
    <>
      <section id="services" className="py-24 px-6 md:px-12 bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for Agents, Brokers & Wholesalers</h2>
            <p className="text-gray-400 max-w-xl">Four core systems that eliminate the manual work between receiving a lead and booking a meeting — so you can focus on closing.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="p-8 glass rounded-sm hover:border-emerald-500/50 transition-all group flex flex-col">
                <div className="mb-6 group-hover:scale-110 transition-transform">{service.icon}</div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500/70 mb-1">{service.badge}</span>
                <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                <span className="text-[10px] text-gray-600 uppercase tracking-wider mb-3">{service.audience}</span>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          {/* CRM compatibility */}
          <div className="mt-16 pt-12 border-t border-white/5">
            <p className="text-sm text-gray-500 text-center mb-6 uppercase tracking-widest font-semibold">Works with your existing CRM</p>
            <div className="flex flex-wrap justify-center gap-3">
              {crms.map(crm => (
                <span key={crm} className="px-4 py-2 rounded-sm border border-white/10 text-sm text-gray-400 bg-white/5">{crm}</span>
              ))}
              <span className="px-4 py-2 rounded-sm border border-white/10 text-sm text-gray-400 bg-white/5">+ more</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Up and Running in 2 Weeks</h2>
          <p className="text-gray-400 mb-16 max-w-xl mx-auto">No lengthy onboarding. No learning curve. We build it, you use it.</p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-6xl font-bold text-emerald-500/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;

