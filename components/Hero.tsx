
import React from 'react';

const Hero: React.FC = () => {
  const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation";

  return (
    <section className="relative pt-44 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10"></div>

      <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
        Stop Losing Deals to Slow Follow-Up.
        <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">Win More Listings</span> in Less Time.
      </h1>

      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
        We help top-producing agents respond to leads in under 60 seconds, filter out time-wasters, and book more showings — without hiring an assistant.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={CALENDLY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-sm font-bold text-lg transition-all"
        >
          Book a Consultation
        </a>
        <a
          href="#services"
          className="glass hover:bg-white/10 px-8 py-4 rounded-sm font-bold text-lg transition-all"
        >
          Explore Automations
        </a>
      </div>

      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2 font-semibold">INSTANT FOLLOW-UP</div>
        <div className="flex items-center gap-2 font-semibold">LEAD SCORING</div>
        <div className="flex items-center gap-2 font-semibold">5-MIN LISTINGS</div>
        <div className="flex items-center gap-2 font-semibold">AUTO SHOWINGS</div>
      </div>
    </section>
  );
};

export default Hero;
