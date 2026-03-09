
import React from 'react';

const Hero: React.FC = () => {
  const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation";

  return (
    <section className="relative pt-44 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10"></div>

      {/* Social proof badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Built for top-producing real estate agents
      </div>

      <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
        Stop Losing Deals to Slow Follow-Up.{' '}
        <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">Win More Listings</span> in Less Time.
      </h1>

      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
        We build custom AI systems that respond to your Zillow and website leads in under 60 seconds, qualify buyers automatically, and keep your CRM updated — without you lifting a finger.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={CALENDLY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-sm font-bold text-lg transition-all shadow-lg shadow-emerald-500/20"
        >
          Book a Free Strategy Call
        </a>
        <a
          href="#services"
          className="glass hover:bg-white/10 px-8 py-4 rounded-sm font-bold text-lg transition-all"
        >
          See How It Works
        </a>
      </div>

      {/* Stats row */}
      <div className="mt-16 flex flex-col sm:flex-row gap-8 sm:gap-16 text-center">
        <div>
          <div className="text-3xl font-bold text-white">&lt;60s</div>
          <div className="text-sm text-gray-500 mt-1">Lead Response Time</div>
        </div>
        <div className="hidden sm:block w-px bg-white/10"></div>
        <div>
          <div className="text-3xl font-bold text-white">15+</div>
          <div className="text-sm text-gray-500 mt-1">Hours Saved Per Week</div>
        </div>
        <div className="hidden sm:block w-px bg-white/10"></div>
        <div>
          <div className="text-3xl font-bold text-white">5 min</div>
          <div className="text-sm text-gray-500 mt-1">To Publish a Listing</div>
        </div>
        <div className="hidden sm:block w-px bg-white/10"></div>
        <div>
          <div className="text-3xl font-bold text-white">0</div>
          <div className="text-sm text-gray-500 mt-1">New Hires Required</div>
        </div>
      </div>

      {/* Feature tags */}
      <div className="mt-12 flex flex-wrap justify-center gap-3 opacity-60">
        {['Instant Follow-Up', 'Lead Scoring', '5-Min Listings', 'Auto Showings', 'Zero Data Entry', 'CRM Sync'].map(tag => (
          <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-gray-400 tracking-wide">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Hero;

