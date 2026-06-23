import React from 'react';

const services = [
  {
    badge: "ROI Recovery",
    title: "Lead Reactivation Engine",
    audience: "Agents · Brokers",
    description: "Your old CRM leads aren't dead — they're dormant. Our AI reads each contact's history, writes personalized reactivation emails, verifies them for accuracy, and automatically follows up to book appointments. No templates. No manual work.",
    icon: (
      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
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
  }
];

const reactivationSteps = [
  {
    number: "01",
    title: "Export Your Old Leads",
    description: "You give us a CSV export or temporary CRM access. We handle the rest — no tech knowledge required."
  },
  {
    number: "02",
    title: "AI Writes Personalized Emails",
    description: "Our system reads each lead's history and generates custom reactivation emails — not generic templates."
  },
  {
    number: "03",
    title: "Hallucination Check & Send",
    description: "A second AI verifies every email for accuracy (no made-up facts), then sends automatically via your domain."
  },
  {
    number: "04",
    title: "Auto-Classify Replies",
    description: "Inbound replies are analyzed by intent — interested, not interested, needs more info — and routed accordingly."
  },
  {
    number: "05",
    title: "Qualified Leads → Your Calendar",
    description: "Hot leads get booking links sent automatically. You show up to pre-qualified appointments, not cold calls."
  }
];

const crms = ["Follow Up Boss", "LionDesk", "KvCORE", "Salesforce", "HubSpot", "Chime", "Sierra Interactive"];

const Services: React.FC = () => {
  return (
    <>
      {/* Day-in-the-life scenario — the visceral narrative hook */}
      <section className="py-16 px-6 md:px-12 bg-neutral-900/40 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500/70 mb-4 block">
            What This Looks Like in Practice
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
            A Tuesday Morning — Before vs. After Devobi
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* Before */}
            <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Without Devobi</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-2"><span className="text-red-400 flex-shrink-0">7:42am</span>Zillow lead comes in. You're in a showing.</li>
                <li className="flex gap-2"><span className="text-red-400 flex-shrink-0">9:15am</span>You finally see it. Lead has already called two other agents.</li>
                <li className="flex gap-2"><span className="text-red-400 flex-shrink-0">11:00am</span>You send a generic "Thanks for your interest" email.</li>
                <li className="flex gap-2"><span className="text-red-400 flex-shrink-0">No reply.</span>Lead goes cold. Commission lost.</li>
                <li className="flex gap-2 mt-4"><span className="text-red-400 flex-shrink-0">Also:</span>Your 200 old CRM leads sit untouched. Again.</li>
              </ul>
            </div>
            {/* After */}
            <div className="p-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">With Devobi</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-2"><span className="text-emerald-400 flex-shrink-0">7:42am</span>Zillow lead comes in. System responds in 38 seconds.</li>
                <li className="flex gap-2"><span className="text-emerald-400 flex-shrink-0">7:43am</span>Personalized SMS qualifies them — "Are you pre-approved?"</li>
                <li className="flex gap-2"><span className="text-emerald-400 flex-shrink-0">8:10am</span>Lead books a 10am showing directly on your calendar.</li>
                <li className="flex gap-2"><span className="text-emerald-400 flex-shrink-0">You:</span>Still in your first showing. Never touched your phone.</li>
                <li className="flex gap-2 mt-4"><span className="text-emerald-400 flex-shrink-0">Also:</span>12 reactivation emails sent to old leads overnight. 3 replied.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 px-6 md:px-12 bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for Agents, Brokers & Wholesalers</h2>
            <p className="text-gray-400 max-w-xl">Four core systems that eliminate the manual work between receiving a lead and booking a meeting — so you can focus on closing.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="p-8 glass rounded-lg hover:border-emerald-500/50 transition-all group flex flex-col">
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
                <span key={crm} className="px-4 py-2 rounded-md border border-white/10 text-sm text-gray-400 bg-white/5">{crm}</span>
              ))}
              <span className="px-4 py-2 rounded-md border border-white/10 text-sm text-gray-400 bg-white/5">+ more</span>
            </div>
          </div>
        </div>
      </section>

      {/* How Lead Reactivation Works */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-neutral-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How the Lead Reactivation Engine Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From dormant database to booked appointments — completely automated. No manual follow-up. No copying and pasting.
              Just results.
            </p>
          </div>

          <div className="space-y-12">
            {reactivationSteps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-500">{step.number}</span>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 glass rounded-lg border border-emerald-500/30">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-bold text-lg mb-2">Currently Running Pilot Programs in DFW</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We're running free 14-day pilots with select DFW agents to build case studies. If you don't get at least 3 qualified 
                  responses from your old leads, you pay nothing. We're DFW-local — Frisco-based — and spots are limited.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
