import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CALENDLY_LINK = 'https://calendly.com/obinnae/ai-consultation?utm_source=voice_page&utm_campaign=voice_agent';
const LOOM_LINK = 'https://www.loom.com/embed/d9edc08096af49ff9c06e6e53e2dcf4c';

/** Loads the Calendly widget script once so initPopupWidget is available. */
const loadCalendlyWidget = () => {
  if (document.getElementById('calendly-widget-css')) return;
  const link = document.createElement('link');
  link.id = 'calendly-widget-css';
  link.rel = 'stylesheet';
  link.href = 'https://assets.calendly.com/assets/external/widget.css';
  document.head.appendChild(link);

  if (document.getElementById('calendly-widget-js')) return;
  const script = document.createElement('script');
  script.id = 'calendly-widget-js';
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;
  document.head.appendChild(script);
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character] || character));

const PhoneIcon = () => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LightningIcon = () => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L4 13h6l-1 9 9-11h-6l1-9z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-[18px] h-[18px] text-accent flex-shrink-0 mt-[3px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const Eyebrow = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <span className={`inline-flex items-center gap-2 text-[0.76rem] font-semibold tracking-[0.14em] uppercase rounded-full px-[14px] py-[7px] ${dark ? 'text-[#B7B1A4] border border-[#3A352B] bg-transparent' : 'text-muted border border-line bg-white dark:bg-gray-800'}`}>
    <span className="w-[7px] h-[7px] rounded-full bg-accent" />
    {children}
  </span>
);

const VoiceLandingPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCalendlyWidget();
  }, []);

  const openCalendly = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const widget = (window as any).Calendly;
    if (widget?.initPopupWidget) {
      widget.initPopupWidget({ url: CALENDLY_LINK });
    } else {
      window.open(CALENDLY_LINK, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePilotSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (formData.get('_honey')) return;

    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const industry = String(formData.get('industry') || '');
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeIndustry = escapeHtml(industry);

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'obi@devobi.com',
          subject: 'New 14-Day Free Pilot Request for Voice Agent',
          text: `Name: ${name}\nEmail: ${email}\nIndustry: ${industry}`,
          html: `<div><h2>New 14-Day Free Pilot Request for Voice Agent</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Industry:</strong> ${safeIndustry}</p></div>`,
        }),
      });

      if (!response.ok) throw new Error('Pilot request could not be sent.');

      setSubmitted(true);
      form.reset();
      await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Your 14-Day Free Pilot Request for Voice Agent',
          text: `Hi ${name},\n\nThanks for your interest in the 14-day free pilot for Voice Agent. Choose a time for a quick kickoff call here: ${CALENDLY_LINK}\n\nWe look forward to learning more about your ${industry} business.`,
          html: `<div><p>Hi ${safeName},</p><p>Thanks for your interest in the 14-day free pilot for Voice Agent. Choose a time for a quick kickoff call using the link below:</p><p><a href="${CALENDLY_LINK}">Schedule your kickoff call</a></p><p>We look forward to learning more about your ${safeIndustry} business.</p></div>`,
        }),
      }).catch(() => undefined);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cream text-ink font-sans antialiased pt-[68px]">
      <section className="py-[88px] max-lg:py-[72px]">
        <div className="wrap max-w-[760px] text-center mx-auto">
          <Eyebrow>AI Voice Agent</Eyebrow>
          <h1 className="text-ink text-[clamp(2.5rem,5.2vw,3.75rem)] font-extrabold tracking-[-0.03em] leading-[1.12] mt-[22px] mb-[18px]">
            Your business answers every call. Even when your team is busy.
          </h1>
          <p className="text-[1.13rem] text-muted max-w-[56ch] mx-auto leading-relaxed mb-[30px]">
            Devobi builds AI voice agents that answer inbound calls, qualify prospects, book appointments,
            and follow up without making your customers wait on hold. It sounds natural, works around the clock,
            and gets your team back to the work that matters most.
          </p>
          <div className="flex gap-[14px] flex-wrap justify-center mb-[14px]">
            <Link to="/voicedemo" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] bg-accent text-white hover:bg-accent-dark transition-colors">
              Try the Live Demo →
            </Link>
            <Link to="#pilot" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] bg-ink dark:bg-gray-800 text-white hover:bg-accent transition-colors">
              Start a Free 14-Day Pilot →
            </Link>
            <a href={CALENDLY_LINK} onClick={openCalendly} className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] border border-line text-ink hover:border-ink transition-colors">
              Schedule a free consultation
            </a>
          </div>
          <p className="text-[0.85rem] text-muted">
            ✓ <b className="text-ink">Always-on</b> answering, qualification, and scheduling
          </p>
        </div>
      </section>

      <section className="py-[56px] border-t border-line border-b bg-white dark:bg-gray-800">
        <div className="wrap grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="text-center max-sm:pb-7 max-sm:border-b border-line sm:border-r sm:pr-10 last:border-r-0">
            <div className="text-[clamp(2rem,3.4vw,2.7rem)] font-extrabold tracking-[-0.03em]">
              <em className="not-italic text-accent">24/7</em>
            </div>
            <p className="text-muted text-[0.92rem] max-w-[30ch] mx-auto mt-[6px]">never miss a lead after hours, on weekends, or while you’re in the field</p>
          </div>
          <div className="text-center max-sm:pb-7 max-sm:border-b border-line sm:border-r sm:pr-10 last:border-r-0">
            <div className="text-[clamp(2rem,3.4vw,2.7rem)] font-extrabold tracking-[-0.03em]">
              <em className="not-italic text-accent">&lt;1</em> <span className="text-[1.1rem] align-middle">ring</span>
            </div>
            <p className="text-muted text-[0.92rem] max-w-[30ch] mx-auto mt-[6px]">customers get a fast, human-sounding response instead of voicemail</p>
          </div>
          <div className="text-center">
            <div className="text-[clamp(2rem,3.4vw,2.7rem)] font-extrabold tracking-[-0.03em]">
              <em className="not-italic text-accent">3x</em>
            </div>
            <p className="text-muted text-[0.92rem] max-w-[30ch] mx-auto mt-[6px]">more consistent follow-up than manual teams trying to juggle everything</p>
          </div>
        </div>
      </section>

      <section id="how" className="py-24 max-lg:py-[72px] border-t border-line">
        <div className="wrap">
          <div className="max-w-[640px] mb-[56px] mx-auto text-center">
            <Eyebrow>What It Does</Eyebrow>
            <h2 className="text-ink text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] mt-[18px] mb-[14px]">
              Human-sounding voice automation, built for real business calls.
            </h2>
            <p className="text-[1.13rem] text-muted max-w-[56ch] mx-auto">
              The AI agent answers the phone, understands the caller’s intent, asks the right follow-up questions,
              books the next step, and keeps the conversation moving without losing the human feel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[820px] mx-auto">
            <div className="bg-white dark:bg-gray-800 border border-line rounded-[18px] p-[30px]">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-accent-soft text-accent flex items-center justify-center mb-[18px]">
                <PhoneIcon />
              </div>
              <h3 className="text-ink text-[1.15rem] font-extrabold tracking-[-0.02em] mb-[10px]">Answers and qualifies</h3>
              <p className="text-[0.93rem] text-muted leading-relaxed">
                It greets the caller, listens for the problem, asks the right questions, and routes the conversation with natural-sounding clarity.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-line rounded-[18px] p-[30px]">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-accent-soft text-accent flex items-center justify-center mb-[18px]">
                <LightningIcon />
              </div>
              <h3 className="text-ink text-[1.15rem] font-extrabold tracking-[-0.02em] mb-[10px]">Books instantly</h3>
              <p className="text-[0.93rem] text-muted leading-relaxed">
                It schedules appointments, captures key details, and can hand off to your team with the context already attached.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-lg:py-[72px] border-t border-line">
        <div className="wrap max-w-[960px] mx-auto">
          <div className="max-w-[700px] mx-auto text-center mb-[24px]">
            <Eyebrow>See It In Action</Eyebrow>
            <h2 className="text-ink text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] mt-[18px] mb-[14px]">
              Loom demo walkthrough
            </h2>
            <p className="text-[1.13rem] text-muted">
              Watch a quick example of the AI call flow, lead qualification, and appointment booking in motion.
            </p>
          </div>

          <div className="w-full glass rounded-[8px] overflow-hidden border border-line shadow-[0_24px_60px_-24px_rgba(23,20,15,0.18)]" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={LOOM_LINK}
              frameBorder="0"
              allowFullScreen
              title="AI voice agent demo video"
              className="w-full h-full absolute inset-0"
              style={{ top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </section>

      <section id="pilot" className="py-0 pb-[88px]">
        <div className="wrap">
          <div className="bg-dark text-[#F5F2E9] rounded-[8px] p-8 max-lg:p-[44px_28px] grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <Eyebrow dark>Built for Real Teams</Eyebrow>
              <h2 className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] text-white mt-[18px] mb-[14px]">
                Let your AI agent handle the first response so your team can focus on the work.
              </h2>
              <p className="text-[1.13rem] text-[#B7B1A4] max-w-[56ch]">
                From missed calls to appointment capture, the voice system can become your silent front desk — always available, always polite, always moving the opportunity forward.
              </p>
              <ul className="list-none mt-[26px] flex flex-col gap-3">
                <li className="flex gap-3 items-start text-[0.95rem]"><CheckIcon />Works on your existing business phone flow</li>
                <li className="flex gap-3 items-start text-[0.95rem]"><CheckIcon />Captures details and books the next step</li>
                <li className="flex gap-3 items-start text-[0.95rem]"><CheckIcon />No heavy software setup required</li>
              </ul>
              <div className="mt-[30px]">
                <a href={CALENDLY_LINK} onClick={openCalendly} className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] border border-[#3A352B] text-white hover:border-white transition-colors">
                  Book a free consultation
                </a>
              </div>
            </div>
            <div className="bg-[#221E17] border border-[#373226] rounded-[8px] p-9">
              <div className="text-[1.4rem] font-extrabold tracking-[-0.02em] mb-2 text-white">Start your free 14-day pilot</div>
              <p className="text-[0.88rem] text-[#B7B1A4] mb-6">Tell us a little about your business. We'll be in touch to arrange your kickoff call.</p>
              {submitted ? (
                <div className="text-center py-12" role="status">
                  <h3 className="text-2xl font-bold text-accent mb-4">We've received your request.</h3>
                  <p className="text-[#B7B1A4]">Check your inbox for next steps and a link to schedule your kickoff call.</p>
                </div>
              ) : (
                <form onSubmit={handlePilotSubmit} className="flex flex-col gap-3">
                  <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    className="w-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-[#373226] text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                    autoComplete="email"
                    className="w-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-[#373226] text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                  <select
                    name="industry"
                    required
                    defaultValue=""
                    className="w-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-[#373226] text-ink outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                  >
                    <option value="" disabled>Select your industry...</option>
                    <option value="HVAC">HVAC</option>
                  <option value="Plumbing">Plumbing</option>
                    <option value="Roofing">Roofing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Solar">Solar</option>
                    <option value="Other home service">Other home service</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer font-semibold text-[0.95rem] px-[26px] py-[13px] bg-accent text-white hover:bg-accent-dark disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors w-full"
                  >
                    {isLoading ? 'Submitting...' : 'Apply for Free 14-Day Pilot'}
                  </button>
                  {error && <p className="text-center text-sm text-red-500" role="alert">{error}</p>}
                  <p className="text-center text-xs text-muted/60">
                    We respect your privacy. Your information is never shared or sold.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VoiceLandingPage;
