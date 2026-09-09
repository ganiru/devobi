import React, { useState, useEffect } from 'react';
import './index.css';
import './App.css';
import './components/VoiceAgent/VoiceAgent.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Treatments from './components/Treatments/Treatments';
import BeforeAfter from './components/BeforeAfter/BeforeAfter';
import VoiceAgentButton from './components/VoiceAgent/VoiceAgentButton';
import VoiceAgentModal from './components/VoiceAgent/VoiceAgentModal';
import BookingModal from './components/BookingModal/BookingModal';

export default function PlumberApp() {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('plumber-dark');
    return () => document.documentElement.classList.remove('plumber-dark');
  }, []);

  const handleOpenBooking = () => setIsBookingOpen(true);

  return (
    <div className="plumber-app">
      {/* Floating ambient background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[460px] h-[460px] bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Navbar */}
      <Navbar
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Main Content */}
      <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Hero
          onOpenVoice={() => setIsVoiceOpen(true)}
          onOpenBooking={handleOpenBooking}
        />
        <Treatments onOpenVoice={() => setIsVoiceOpen(true)} />
        <BeforeAfter onOpenBooking={handleOpenBooking} />
      </main>

      {/* Persistent Floating Voice Agent Orb */}
      <VoiceAgentButton
        isOpen={isVoiceOpen}
        onClick={() => setIsVoiceOpen(!isVoiceOpen)}
      />

      {/* Expandable Voice Agent Dock */}
      <VoiceAgentModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
