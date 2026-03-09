
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SurveyBanner from './components/SurveyBanner';
import Hero from './components/Hero';
import Services from './components/Services';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-black">
      <header className="fixed top-0 left-0 w-full z-50">
        <SurveyBanner />
        <Navbar />
      </header>
      <main className="flex-grow">
        <Hero />
        <Services />
        <Contact />
      </main>
      <footer className="py-12 px-6 border-t border-white/10 text-center text-gray-500">
        <p className="font-semibold text-gray-400">&copy; {new Date().getFullYear()} Devobi LLC. All rights reserved.</p>
        <p className="mt-2 text-sm italic">Automating the future of real estate.</p>
        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-600">
          <a href="mailto:info@devobi.com" className="hover:text-emerald-400 transition-colors">info@devobi.com</a>
          <span>·</span>
          <a href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

export default App;
