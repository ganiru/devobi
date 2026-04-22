import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation";

  return (
    <section className="relative pt-44 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10"></div>

      {/* Pilot availability badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Free 14-Day Pilot Available (DFW Only)
      </div>

      <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
        Your CRM is a{' '}
        <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">Goldmine</span>.{' '}
        You Just Need a Pickaxe.
      </h1>

      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
        We turn your dead leads into booked appointments — automatically. No manual follow-up. No guesswork. 
        Just personalized AI outreach that reactivates cold contacts and fills your calendar.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/workflow-audit"
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-sm font-bold text-lg transition-all shadow-lg shadow-emerald-500/20"
        >
          Start Free 14-Day Pilot →
        </Link>
        <a
          href={CALENDLY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="glass hover:bg-white/10 px-8 py-4 rounded-sm font-bold text-lg transition-all"
        >
          Book Strategy Call
        </a>
      </div>

      <p className="mt-4 text-sm text-gray-400">
        ✓ Zero risk pilot • If you don't get 3+ qualified responses, you pay nothing
      </p>

      {/* Stats row */}
      <div className="mt-16 flex flex-col sm:flex-row gap-8 sm:gap-16 text-center">
        <div>
          <div className="text-3xl font-bold text-white">200+</div>
          <div className="text-sm text-gray-500 mt-1">Old Leads Reactivated</div>
        </div>
        <div className="hidden sm:block w-px bg-white/10"></div>
        <div>
          <div className="text-3xl font-bold text-white">14 Days</div>
          <div className="text-sm text-gray-500 mt-1">To See Results</div>
        </div>
        <div className="hidden sm:block w-px bg-white/10"></div>
        <div>
          <div className="text-3xl font-bold text-white">0</div>
          <div className="text-sm text-gray-500 mt-1">Manual Work Required</div>
        </div>
        <div className="hidden sm:block w-px bg-white/10"></div>
        <div>
          <div className="text-3xl font-bold text-white">&lt;60s</div>
          <div className="text-sm text-gray-500 mt-1">Lead Response Time</div>
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
