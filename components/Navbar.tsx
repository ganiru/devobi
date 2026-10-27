import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const Navbar: React.FC = () => {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, '');
  const isVoicePage = normalizedPath === '/voice';
  const isPlumbersPage = ['/plumbers', '/for-plumbers'].includes(normalizedPath);
  const isPlumberVoiceDemoPage = normalizedPath === '/plumber-voice-demo';
  // Single-agent deep links (/voicedemo/plumber) get the same distraction-free
  // treatment as the picker page.
  const isVoiceDemoPage = normalizedPath === '/voicedemo' || normalizedPath.startsWith('/voicedemo/');
  const hideNavLinks = isPlumberVoiceDemoPage || isVoiceDemoPage;

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-line">
      <div className="max-w-page mx-auto px-6 flex items-center justify-between h-[68px]">
        <a href="/" className="font-extrabold text-lg tracking-tight no-underline text-ink">
          Devobi<span className="text-accent">.</span>
        </a>
        {!hideNavLinks && (
          <div className="hidden md:flex items-center gap-8 list-none">
            <a href="#how" className="text-muted text-sm font-medium no-underline hover:text-ink transition-colors">How It Works</a>
            {isVoicePage ? (
              <a href="https://www.loom.com/share/d9edc08096af49ff9c06e6e53e2dcf4c" target="_blank" rel="noopener noreferrer" className="text-muted text-sm font-medium no-underline hover:text-ink transition-colors">Demo Video</a>
            ) : isPlumbersPage ? (
              <a href="#demo" className="text-muted text-sm font-medium no-underline hover:text-ink transition-colors">Watch the Demo</a>
            ) : (
              <a href="#trades" className="text-muted text-sm font-medium no-underline hover:text-ink transition-colors">The Trades</a>
            )}
            <a href="#pilot" className="text-muted text-sm font-medium no-underline hover:text-ink transition-colors">Pilot</a>
            <a href="/voicedemo" className="text-muted text-sm font-medium no-underline hover:text-ink transition-colors">Voice Demo</a>
          </div>
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-line text-muted hover:text-ink hover:border-ink transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>
          <a
            href="https://calendly.com/obinnae/ai-consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-sm no-underline rounded-full border border-transparent px-[20px] py-[10px] bg-ink dark:bg-gray-800 text-white hover:bg-accent transition-colors"
          >
            Book a Call
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;