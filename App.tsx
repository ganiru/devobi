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
import PlumbersLandingPage from './components/PlumbersLandingPage';

export const ScrollToAnchor = () => {
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
      {/* The Router is supplied by the caller so this same tree can be
          rendered in the browser (BrowserRouter) and at build time by the
          prerenderer (StaticRouter). Keeping one shared tree guarantees the
          prerendered HTML matches what users see. */}
      <ScrollToAnchor />
      <AppRoutes />
    </ThemeProvider>
  );
};

export const AppRoutes = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith('/medspa')) {
    return <MedspaApp />;
  }
  if (pathname.startsWith('/plumber')) {
    return <PlumberApp />;
  }
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-black bg-cream text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white no-underline"
      >
        Skip to main content
      </a>
      <header className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </header>
      <main id="main-content" tabIndex={-1} className="flex-grow">
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
          <Route path="/for-plumbers" element={<PlumbersLandingPage />} />
        </Routes>
      </main>
      <footer className="border-t border-line py-9 px-6 text-[0.85rem] text-muted bg-cream">
        <div className="max-w-[1120px] mx-auto flex justify-between gap-4 flex-wrap">
          <span>&copy; {new Date().getFullYear()} Devobi LLC · AI Lead Reactivation for Home Services</span>
          <nav aria-label="Footer" className="flex gap-4 flex-wrap items-center">
            <Link to="/for-plumbers" className="text-muted no-underline hover:text-ink transition-colors">For Plumbers</Link>
            <Link to="/free-pilot" className="text-muted no-underline hover:text-ink transition-colors">Free Pilot</Link>
            <Link to="/privacy" className="text-muted no-underline hover:text-ink transition-colors">Privacy</Link>
            <a href="mailto:info@devobi.com" className="text-muted no-underline hover:text-ink transition-colors">info@devobi.com</a>
          </nav>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

export default App;
