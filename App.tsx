import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
// import SurveyBanner from './components/SurveyBanner';
import Hero from './components/Hero';
import Services from './components/Services';
import AboutFounder from './components/AboutFounder';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import Privacy from './components/Privacy';
import WorkflowAudit from './components/WorkflowAudit';
import DemoLeadForm from './components/DemoLeadForm';
import Founding from './components/Founding';
import OptIn from './components/OptIn';
import SendMail from './components/SendMail';
import LeadReactivationForm from './components/LeadReactivationForm';
import FreePilot from './components/FreePilot';

const ScrollToAnchor = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);

  return null;
};

const LandingPage = () => (
  <>
    <Hero />
    <Services />
    <AboutFounder />
    <Contact />
  </>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToAnchor />
      <div className="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-black">
        <header className="fixed top-0 left-0 w-full z-50">
          {/* <SurveyBanner /> */}
          <Navbar />
        </header>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/workflow-audit" element={<WorkflowAudit />} />
            <Route path="/demo-lead-form" element={<DemoLeadForm />} />
            <Route path="/founding" element={<Founding />} />
            <Route path="/opt-in" element={<OptIn />} />
            <Route path="/sendmail" element={<SendMail />} />
            <Route path="/reactivate" element={<LeadReactivationForm />} />
            <Route path="/free-pilot" element={<FreePilot />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
        <footer className="py-12 px-6 border-t border-white/10 text-center text-gray-500">
          <p className="font-semibold text-gray-400">&copy; {new Date().getFullYear()} Devobi LLC. All rights reserved.</p>
          <p className="mt-2 text-sm italic text-gray-600">AI automation for DFW real estate professionals — built in Frisco, TX.</p>
          <div className="mt-4 flex justify-center gap-6 text-xs text-gray-600">
            <a href="mailto:info@devobi.com" className="hover:text-emerald-400 transition-colors">info@devobi.com</a>
            <span>·</span>
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </footer>
        <Chatbot />
      </div>
    </BrowserRouter>
  );
};

export default App;
