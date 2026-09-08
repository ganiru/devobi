// @ts-nocheck Transitional conversion: preserve the existing Medspa component API.
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Treatments from './components/Treatments/Treatments';
import BeforeAfter from './components/BeforeAfter/BeforeAfter';
import TreatmentQuiz from './components/TreatmentQuiz/TreatmentQuiz';
import Memberships from './components/Memberships/Memberships';
import Credentials from './components/Credentials/Credentials';
import Footer from './components/Footer/Footer';
import BookingModal from './components/BookingModal/BookingModal';
import VoiceAgentButton from './components/VoiceAgent/VoiceAgentButton';
import VoiceAgentModal from './components/VoiceAgent/VoiceAgentModal';

import './index.css';
import './App.css';
import './components/VoiceAgent/VoiceAgent.css';

export default function App() {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTreatment, setBookingTreatment] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('medspa-dark');

    return () => {
      document.documentElement.classList.remove('medspa-dark');
    };
  }, []);

  const handleOpenBookingWithTreatment = (treatmentName) => {
    setBookingTreatment(treatmentName);
    setIsBookingOpen(true);
  };

  const handleOpenBooking = () => {
    setBookingTreatment('');
    setIsBookingOpen(true);
  };

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <Navbar 
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Main Page Content */}
      <main id="main-content">
        <Hero 
          onOpenVoice={() => setIsVoiceOpen(true)}
          onOpenBooking={handleOpenBooking}
        />

        <Treatments 
          onOpenVoice={() => setIsVoiceOpen(true)}
          onSelectTreatmentForBooking={handleOpenBookingWithTreatment}
        />

        <BeforeAfter 
          onOpenBooking={handleOpenBooking}
        />

        <TreatmentQuiz 
          onOpenVoice={() => setIsVoiceOpen(true)}
          onSelectTreatmentForBooking={handleOpenBookingWithTreatment}
        />

        <Memberships 
          onOpenBooking={handleOpenBooking}
        />

        <Credentials />
      </main>

      {/* Luxury Footer */}
      <Footer 
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Persistent Floating Voice AI Agent Orb */}
      <VoiceAgentButton 
        isOpen={isVoiceOpen}
        onClick={() => setIsVoiceOpen(!isVoiceOpen)}
      />

      {/* Expandable Voice AI Concierge Dock */}
      <VoiceAgentModal 
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Private Consultation Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultTreatment={bookingTreatment}
      />
    </div>
  );
}
