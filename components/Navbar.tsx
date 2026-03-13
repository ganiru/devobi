
import React from 'react';

const Navbar: React.FC = () => {
  const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation?utm_source=navbar&utm_campaign=audit_launch";

  return (
    <nav className="w-full glass py-4 px-6 md:px-12 flex justify-between items-center relative">
      <div className="flex items-center gap-2" onClick={() => window.location.href = "/"} style={{ cursor: "pointer" }}>
        <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center font-bold text-black text-xl">D</div>
        <span className="text-xl font-semibold tracking-tighter">Devobi LLC</span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
        <a href="#services" className="hover:text-emerald-400 transition-colors">Services</a>
        <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
        <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
        <a href="mailto:info@devobi.com" className="hover:text-emerald-400 transition-colors">info@devobi.com</a>
        <a href="/demo-lead-form" className="hover:text-emerald-400 transition-colors cursor-pointer">Demo Lead Form</a>
      </div>
      <a
        onClick={(e) => {
          e.preventDefault();
          window.history.pushState({}, '', '/workflow-audit?utm_source=contact&utm_campaign=audit_launch');
          window.dispatchEvent(new PopStateEvent('popstate'));
          window.scrollTo(0, 0);

          // Add analytics (if using Google Analytics, Plausible, etc.)
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'click', {
              event_category: 'CTA',
              event_label: 'Workflow Audit - Homepage',
            });
          }
        }}
        className="bg-emerald-500 cursor-pointer hover:bg-emerald-400 text-black px-4 py-2 rounded-sm text-sm font-bold transition-all transform active:scale-95"
      >
        Get Your Free Workflow Audit →
      </a>

    </nav>
  );
};

export default Navbar;
