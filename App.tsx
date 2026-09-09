import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Chatbot from './components/Chatbot';
import Privacy from './components/Privacy';
import WorkflowAudit from './components/WorkflowAudit';
import DemoLeadForm from './components/DemoLeadForm';
import Founding from './components/Founding';
import OptIn from './components/OptIn';
import SendMail from './components/SendMail';
import LeadReactivationForm from './components/LeadReactivationForm';
import FreePilot from './components/FreePilot';
import DemoVideo from './components/DemoVideo';
import MedspaApp from './medspa/App';
import PlumberApp from './plumber/App';

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

const App: React.FC = () => {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <ScrollToAnchor />
      <AppRoutes />
    </BrowserRouter>
    </ThemeProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith('/medspa')) {
    return <MedspaApp />;
  }
  if (pathname.startsWith('/plumber')) {
    return <PlumberApp />;
  }
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-black bg-cream text-ink">
      <header className="fixed top-0 left-0 w-full z-50">
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
          <Route path="/demovideo" element={<DemoVideo />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <footer className="border-t border-line py-9 px-6 text-[0.85rem] text-muted bg-cream">
        <div className="max-w-[1120px] mx-auto flex justify-between gap-4 flex-wrap">
          <span>&copy; {new Date().getFullYear()} Devobi LLC · AI Lead Reactivation for Home Services</span>
          <a href="mailto:info@devobi.com" className="text-muted no-underline hover:text-ink transition-colors">info@devobi.com</a>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

export default App;
