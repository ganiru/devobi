
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-black">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Contact />
      </main>
      <footer className="py-12 px-6 border-t border-white/10 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Devobi LLC. All rights reserved.</p>
        <p className="mt-2 text-sm italic">Automating the future of real estate.</p>
      </footer>
      <Chatbot />
    </div>
  );
};

export default App;
