import React from 'react';
import { Link } from 'react-router-dom';

const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation?utm_source=plumbers_page&utm_campaign=plumber_pilot";

const PhoneIcon = () => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const RecoveryIcon = () => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

const PlumbersLandingPage: React.FC = () => {
  return (
    <div className="bg-cream text-ink font-sans antialiased pt-[68px]">

      {/* HERO */}
      <section className="py-[88px] max-lg:py-[72px]">
        <div className="wrap max-w-[760px] text-center mx-auto">
          <Eyebrow>Built After a Water Heater Emergency, at 11pm</Eyebrow>
          <h1 className="text-ink text-[clamp(2.5rem,5.2vw,3.75rem)] font-extrabold tracking-[-0.03em] leading-[1.12] mt-[22px] mb-[18px]">
            Every call you miss is a job someone else books.
          </h1>
          <p className="text-[1.13rem] text-muted max-w-[56ch] mx-auto leading-relaxed mb-[30px]">
            Devobi builds an AI phone agent for plumbers that answers every call — nights, weekends, mid-job —
            and books it straight onto your calendar. Anyone who doesn't book on the spot gets followed up
            automatically until they do.
          </p>
          <div className="flex gap-[14px] flex-wrap justify-center mb-[14px]">
            <Link to="/plumber" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] bg-ink dark:bg-gray-800 text-white hover:bg-accent transition-colors">
              Talk to Aura Right Now →
            </Link>
            <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] border border-line text-ink hover:border-ink transition-colors">
              Book a Strategy Call
            </a>
          </div>
          <p className="text-[0.85rem] text-muted">
            ✓ <b className="text-ink">Live demo</b> — call it yourself, no form required.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-[56px] border-t border-line border-b bg-white dark:bg-gray-800">
        <div className="wrap grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="text-center max-sm:pb-7 max-sm:border-b border-line sm:border-r sm:pr-10 last:border-r-0">
            <div className="text-[clamp(2rem,3.4vw,2.7rem)] font-extrabold tracking-[-0.03em]">
              <em className="not-italic text-accent">24/7</em>
            </div>
            <p className="text-muted text-[0.92rem] max-w-[30ch] mx-auto mt-[6px]">never miss a call, even after hours</p>
          </div>
          <div className="text-center max-sm:pb-7 max-sm:border-b border-line sm:border-r sm:pr-10 last:border-r-0">
            <div className="text-[clamp(2rem,3.4vw,2.7rem)] font-extrabold tracking-[-0.03em]">
              &lt;<em className="not-italic text-accent">1 ring</em>
            </div>
            <p className="text-muted text-[0.92rem] max-w-[30ch] mx-auto mt-[6px]">before Aura picks up and starts qualifying</p>
          </div>
          <div className="text-center">
            <div className="text-[clamp(2rem,3.4vw,2.7rem)] font-extrabold tracking-[-0.03em]">
              <em className="not-italic text-accent">25 yrs</em>
            </div>
            <p className="text-muted text-[0.92rem] max-w-[30ch] mx-auto mt-[6px]">engineering experience behind it</p>
          </div>
        </div>
      </section>

      {/* WHY I BUILT THIS — short origin story, no photo/bio grid */}
      <section className="py-24 max-lg:py-[72px]">
        <div className="wrap max-w-[760px] mx-auto text-center">
          <Eyebrow>Why I Built This</Eyebrow>
          <h2 className="text-ink text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] mt-[18px] mb-[14px]">
            My water heater died at 11pm. Every plumber I called was closed.
          </h2>
          <p className="text-[1.13rem] text-muted leading-relaxed">
            No voicemail felt like it was going anywhere, so I went to bed with no hot water and no idea
            when that would change. I'm Obi Ezeilo, an AI automations engineer in Frisco, TX — that night
            became Aura: a phone agent that answers a plumbing company's line around the clock, qualifies
            the emergency, and books it, so the next caller doesn't have the same night I did.
          </p>
        </div>
      </section>

      {/* TWO PIPES */}
      <section id="how" className="py-24 max-lg:py-[72px] border-t border-line">
        <div className="wrap">
          <div className="max-w-[640px] mb-[56px] mx-auto text-center">
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="text-ink text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] mt-[18px] mb-[14px]">
              Two broken pipes, one fix.
            </h2>
            <p className="text-[1.13rem] text-muted max-w-[56ch] mx-auto">
              Every plumbing business loses money the same two ways — calls that never get answered, and
              leads that got answered once and never followed up.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[820px] mx-auto">
            <div className="bg-white dark:bg-gray-800 border border-line rounded-[18px] p-[30px]">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-accent-soft text-accent flex items-center justify-center mb-[18px]">
                <PhoneIcon />
              </div>
              <h3 className="text-ink text-[1.15rem] font-extrabold tracking-[-0.02em] mb-[10px]">Aura answers the phone</h3>
              <p className="text-[0.93rem] text-muted leading-relaxed">
                A human-sounding AI voice agent picks up every call your office can't — nights, weekends,
                mid-job — qualifies the emergency, and books it on your calendar.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-line rounded-[18px] p-[30px]">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-accent-soft text-accent flex items-center justify-center mb-[18px]">
                <RecoveryIcon />
              </div>
              <h3 className="text-ink text-[1.15rem] font-extrabold tracking-[-0.02em] mb-[10px]">Nobody falls through</h3>
              <p className="text-[0.93rem] text-muted leading-relaxed">
                Callers who don't book on the spot — price shoppers, "let me think about it" — get automatic
                text and email follow-up until they convert or opt out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — dark card, matches site's existing pilot section, no embedded form */}
      <section className="py-0 pb-[88px]">
        <div className="wrap">
          <div className="bg-dark text-[#F5F2E9] rounded-[28px] p-16 max-lg:p-[44px_28px] text-center">
            <Eyebrow dark>Limited Pilot Spots — DFW Plumbers</Eyebrow>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] text-white mt-[18px] mb-[14px]">
              See it work before you decide anything.
            </h2>
            <p className="text-[1.13rem] text-[#B7B1A4] max-w-[56ch] mx-auto mb-[30px]">
              Call the live demo line and talk to Aura yourself — the same way one of your customers would
              at midnight. Then let's talk about putting it on your number.
            </p>
            <ul className="list-none flex flex-col items-center gap-3 mb-[34px]">
              <li className="flex gap-3 items-start text-[0.95rem]"><CheckIcon />Works with your existing number and calendar</li>
              <li className="flex gap-3 items-start text-[0.95rem]"><CheckIcon />No contract to try the live demo</li>
            </ul>
            <div className="flex gap-[14px] flex-wrap justify-center">
              <Link to="/plumber" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] bg-accent text-white hover:bg-accent-dark transition-colors">
                Talk to Aura Right Now →
              </Link>
              <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] border border-[#3A352B] text-white hover:border-white transition-colors">
                Book a Strategy Call
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlumbersLandingPage;
