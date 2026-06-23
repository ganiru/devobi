import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation";

  return (
    <section className="relative pt-44 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Softer, warmer glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/8 blur-[140px] rounded-full -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] bg-emerald-400/5 blur-[80px] rounded-full -z-10"></div>

      {/* Credibility badge — DFW + founder signal */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Built in Frisco, TX — Free 14-Day Pilot Available for DFW Agents
      </div>

      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
        Your Old Leads Are{' '}
        <span className="text-emerald-400">Still Worth Money.</span>
        <br />
        Let AI Collect It.
      </h1>

      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-4 leading-relaxed">
        Devobi builds AI automation systems for DFW real estate agents. We reactivate your cold database,
        respond to new leads in under 60 seconds, and book appointments on your calendar - with zero manual follow-up.
      </p>

      {/* Scenario hook — makes it visceral and local */}
      <p className="text-sm text-gray-500 max-w-xl mb-10 italic">
        "At 7:42am, a Zillow lead comes in on a Frisco listing. Before you finish your coffee,
        the system has responded, qualified them, and added a 10am showing to your calendar."
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/workflow-audit"
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-md font-bold text-lg transition-all shadow-lg shadow-emerald-500/25"
        >
          Start Free 14-Day Pilot →
        </Link>
        <a
          href={CALENDLY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="glass hover:bg-white/10 px-8 py-4 rounded-md font-bold text-lg transition-all text-gray-200"
        >
          Book a Strategy Call
        </a>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        ✓ Zero risk — 3 qualified responses or you pay nothing &nbsp;·&nbsp; ✓ DFW agents only &nbsp;·&nbsp; ✓ Limited spots
      </p>

      {/* Stats row — system capabilities, not client results */}
      <div className="mt-16 flex flex-col sm:flex-row gap-8 sm:gap-16 text-center">
        <div>
          <div className="text-3xl font-bold text-white">&lt;60s</div>
          <div className="text-sm text-gray-500 mt-1">Lead Response Time</div>
        </div>
        <div className="hidden sm:block w-px bg-white/10"></div>
        <div>
          <div className="text-3xl font-bold text-white">14 Days</div>
          <div className="text-sm text-gray-500 mt-1">Pilot — Zero Risk</div>
        </div>
        <div className="hidden sm:block w-px bg-white/10"></div>
        <div>
          <div className="text-3xl font-bold text-white">25 yrs</div>
          <div className="text-sm text-gray-500 mt-1">Engineering Experience</div>
        </div>
        <div className="hidden sm:block w-px bg-white/10"></div>
        <div>
          <div className="text-3xl font-bold text-white">DFW</div>
          <div className="text-sm text-gray-500 mt-1">Local & Focused</div>
        </div>
      </div>

      {/* Feature tags */}
      <div className="mt-12 flex flex-wrap justify-center gap-3 opacity-60">
        {['Dead Lead Revival', 'AI Personalization', 'Auto Follow-Up', 'Reply Classification', 'Calendar Booking', 'CRM Sync'].map(tag => (
          <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-gray-400 tracking-wide">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Hero;
