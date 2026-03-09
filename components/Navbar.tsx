
import React from 'react';

const Navbar: React.FC = () => {
  const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation";

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
      </div>
      <a
        href={CALENDLY_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-sm text-sm font-bold transition-all transform active:scale-95"
      >
        Free Strategy Call
      </a>
    </nav>
  );
};

export default Navbar;
