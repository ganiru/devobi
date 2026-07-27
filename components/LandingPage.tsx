import React, { useState } from 'react';

const RoofingIcon = () => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9h13v-9" /><path d="M9.5 19v-5h5v5" />
  </svg>
);

const HVACKIcon = () => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
  </svg>
);

const SolarIcon = () => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
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

const LandingPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [calcLeads, setCalcLeads] = useState(2000);
  const [calcJobValue, setCalcJobValue] = useState(15000);
  return (
    <div className="bg-cream text-ink font-sans antialiased pt-[68px]">
      <section className="py-[88px] max-lg:py-[72px]">
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>AI Lead Reactivation for Home Services</Eyebrow>
            <h1 className="text-ink text-[clamp(2.5rem,5.2vw,3.75rem)] font-extrabold tracking-[-0.03em] leading-[1.12] mt-[22px] mb-[18px]">
              Your old leads aren't dead. They're dormant.
            </h1>
            <p className="text-[1.13rem] text-muted max-w-[56ch] leading-relaxed mb-[30px]">
              Devobi's AI reads every old quote and cold inquiry in your CRM, writes personalized follow-ups, and books estimates straight onto your calendar. No chasing. No new ad spend.
            </p>
            <div className="flex gap-[14px] flex-wrap mb-[14px]">
              <a href="#pilot" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] bg-ink dark:bg-gray-800 text-white hover:bg-accent transition-colors">
                Start Free 14-Day Pilot →
              </a>
              <a href="#how" className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] border border-line text-ink hover:border-ink transition-colors">
                See How It Works
              </a>
            </div>
            <p className="text-[0.85rem] text-muted">
              ✓ <b className="text-ink">3+ qualified responses guaranteed</b> — or you pay nothing
            </p>
            <div className="flex gap-[10px] mt-[30px] flex-wrap">
              <span className="inline-flex items-center gap-2 border border-line bg-white dark:bg-gray-800 rounded-full px-[16px] py-[8px] text-[0.88rem] font-semibold">
                <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9h13v-9" /><path d="M9.5 19v-5h5v5" /></svg>
                Roofing
              </span>
              <span className="inline-flex items-center gap-2 border border-line bg-white dark:bg-gray-800 rounded-full px-[16px] py-[8px] text-[0.88rem] font-semibold">
                <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" /></svg>
                HVAC
              </span>
              <span className="inline-flex items-center gap-2 border border-line bg-white dark:bg-gray-800 rounded-full px-[16px] py-[8px] text-[0.88rem] font-semibold">
                <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></svg>
                Solar
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-line rounded-[22px] shadow-[0_24px_60px_-24px_rgba(23,20,15,0.18)] p-[22px] flex flex-col gap-[14px]">
            <div className="flex items-center justify-between pb-[14px] border-b border-line">
              <span className="font-bold text-[0.9rem]">Reactivation Engine</span>
              <span className="inline-flex items-center gap-[7px] text-[0.75rem] font-semibold text-[#3F7D53] dark:text-[#6EE7B7] bg-[#EAF4EC] dark:bg-gray-700 rounded-full px-[11px] py-[5px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#4CAF6D]" />
                Live
              </span>
            </div>
            <div className="max-w-[88%] p-[13px_16px] rounded-[16px] text-[0.92rem] leading-relaxed bg-[#F1EFE8] dark:bg-gray-700 rounded-bl-[5px] self-start">
              Hey Mark — last March you got a quote from us for a full roof replacement. Still on your radar? We've got install slots opening this month.
            </div>
            <span className="self-end text-[0.7rem] font-bold tracking-[0.08em] text-accent bg-accent-soft rounded-full px-[11px] py-[4px] uppercase">
              Intent · Interested
            </span>
            <div className="max-w-[88%] p-[13px_16px] rounded-[16px] text-[0.92rem] leading-relaxed bg-ink dark:bg-black text-white rounded-br-[5px] self-end">
              Yeah, actually. Can someone come take a look this week?
            </div>
            <div className="flex gap-3 items-center bg-accent-soft border border-[#F3D5C8] dark:border-gray-600 rounded-[14px] p-[14px_16px] text-[0.9rem] font-semibold">
              <svg className="w-5 h-5 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              <div>
                Estimate booked — Tue 10:00 AM
                <small className="block font-medium text-muted text-[0.78rem]">Synced to ServiceTitan · Office notified</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[56px] border-t border-line border-b bg-white dark:bg-gray-800">
        <div className="wrap grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="text-center max-sm:pb-7 max-sm:border-b border-line sm:border-r sm:pr-10 last:border-r-0">
            <div className="text-[clamp(2rem,3.4vw,2.7rem)] font-extrabold tracking-[-0.03em]">
              <em className="not-italic text-accent">200+</em>
            </div>
            <p className="text-muted text-[0.92rem] max-w-[30ch] mx-auto mt-[6px]">dormant leads reactivated from old CRMs</p>
          </div>
          <div className="text-center max-sm:pb-7 max-sm:border-b border-line sm:border-r sm:pr-10 last:border-r-0">
            <div className="text-[clamp(2rem,3.4vw,2.7rem)] font-extrabold tracking-[-0.03em]">
              &lt;<em className="not-italic text-accent">60s</em>
            </div>
            <p className="text-muted text-[0.92rem] max-w-[30ch] mx-auto mt-[6px]">response time on every new inbound lead</p>
          </div>
          <div className="text-center">
            <div className="text-[clamp(2rem,3.4vw,2.7rem)] font-extrabold tracking-[-0.03em]">
              <em className="not-italic text-accent">3+</em>
            </div>
            <p className="text-muted text-[0.92rem] max-w-[30ch] mx-auto mt-[6px]">qualified responses guaranteed in your pilot — or it's free</p>
          </div>
        </div>
      </section>

      <section id="trades" className="py-24 max-lg:py-[72px]">
        <div className="wrap">
          <div className="max-w-[640px] mb-[56px]">
            <Eyebrow>Who We Serve</Eyebrow>
            <h2 className="text-ink text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] mt-[18px] mb-[14px]">
              Built for the trades.
            </h2>
            <p className="text-[1.13rem] text-muted max-w-[56ch]">
              High-ticket jobs, long decision cycles, and lead lists that never got worked properly. That's exactly where the engine pays for itself.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-gray-800 border border-line rounded-[18px] p-[30px] hover:-translate-y-[3px] hover:shadow-[0_16px_40px_-20px_rgba(23,20,15,0.15)] dark:hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)] transition-all">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-accent-soft text-accent flex items-center justify-center mb-[18px]">
                <RoofingIcon />
              </div>
              <h3 className="text-ink text-[1.15rem] font-extrabold tracking-[-0.02em] mb-[10px]">Roofers</h3>
              <p className="text-[0.93rem] text-muted leading-relaxed">Homeowners collect quotes in spring and sign after storm season. Automated follow-up makes sure the last touch is yours — and that $10K+ replacement lands on your schedule.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-line rounded-[18px] p-[30px] hover:-translate-y-[3px] hover:shadow-[0_16px_40px_-20px_rgba(23,20,15,0.15)] dark:hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)] transition-all">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-accent-soft text-accent flex items-center justify-center mb-[18px]">
                <HVACKIcon />
              </div>
              <h3 className="text-ink text-[1.15rem] font-extrabold tracking-[-0.02em] mb-[10px]">HVAC Pros</h3>
              <p className="text-[0.93rem] text-muted leading-relaxed">That system-replacement quote from last year is a ticking clock. When the unit finally dies, the homeowner calls whoever followed up most recently. Make it you.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-line rounded-[18px] p-[30px] hover:-translate-y-[3px] hover:shadow-[0_16px_40px_-20px_rgba(23,20,15,0.15)] dark:hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)] transition-all">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-accent-soft text-accent flex items-center justify-center mb-[18px]">
                <SolarIcon />
              </div>
              <h3 className="text-ink text-[1.15rem] font-extrabold tracking-[-0.02em] mb-[10px]">Solar Installers</h3>
              <p className="text-[0.93rem] text-muted leading-relaxed">Solar buyers take 6–12 months to decide. Steady, personalized follow-up keeps your quote alive until they're ready to sign — instead of going cold.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="py-24 max-lg:py-[72px]">
        <div className="wrap">
          <div className="max-w-[640px] mb-[56px]">
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="text-ink text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] mt-[18px] mb-[14px]">
              From dormant database to booked estimates.
            </h2>
            <p className="text-[1.13rem] text-muted max-w-[56ch]">
              Four steps, fully automated. No manual follow-up, no copy-paste, no new ad spend.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-t-2 border-line pt-[22px]">
              <span className="block text-[0.78rem] font-bold tracking-[0.15em] text-accent mb-[14px]">01</span>
              <h3 className="text-ink text-[1.05rem] font-extrabold tracking-[-0.02em] mb-[8px]">Export your old leads</h3>
              <p className="text-[0.9rem] text-muted leading-relaxed">Send a CSV or grant temporary CRM access. No tech work on your end — we handle the rest.</p>
            </div>
            <div className="border-t-2 border-line pt-[22px]">
              <span className="block text-[0.78rem] font-bold tracking-[0.15em] text-accent mb-[14px]">02</span>
              <h3 className="text-ink text-[1.05rem] font-extrabold tracking-[-0.02em] mb-[8px]">AI writes the outreach</h3>
              <p className="text-[0.9rem] text-muted leading-relaxed">Every message references the lead's real history — the roof quote, the AC estimate, the solar assessment. Never a generic blast.</p>
            </div>
            <div className="border-t-2 border-line pt-[22px]">
              <span className="block text-[0.78rem] font-bold tracking-[0.15em] text-accent mb-[14px]">03</span>
              <h3 className="text-ink text-[1.05rem] font-extrabold tracking-[-0.02em] mb-[8px]">Replies get verified &amp; sorted</h3>
              <p className="text-[0.9rem] text-muted leading-relaxed">A second AI checks each message for accuracy, then classifies replies by intent and routes them instantly.</p>
            </div>
            <div className="border-t-2 border-line pt-[22px]">
              <span className="block text-[0.78rem] font-bold tracking-[0.15em] text-accent mb-[14px]">04</span>
              <h3 className="text-ink text-[1.05rem] font-extrabold tracking-[-0.02em] mb-[8px]">Jobs land on your calendar</h3>
              <p className="text-[0.9rem] text-muted leading-relaxed">Interested homeowners get your booking link. You show up to estimates — not cold calls.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-0">
        <div className="wrap">
          <div className="bg-dark text-[#F5F2E9] rounded-[28px] p-16 max-lg:p-[44px_28px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Eyebrow dark>Speed-to-Lead</Eyebrow>
              <h2 className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] text-white mt-[18px] mb-[14px]">
                New lead? We're texting them in under a minute.
              </h2>
              <p className="text-[1.13rem] text-[#B7B1A4] max-w-[56ch]">
                The first contractor to respond wins the job. We monitor your lead sources around the clock — nights, weekends, storm days — and fire off a qualifying SMS the second one lands. By the time a competitor calls back, the estimate is already booked.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-[#221E17] border border-[#373226] rounded-[14px] px-5 py-[15px] text-[0.92rem] font-semibold">
                <span>Google Local Services</span>
                <span className="text-[0.78rem] text-[#8FBF9A] font-bold">SMS sent · 11s</span>
              </div>
              <div className="flex justify-between items-center bg-[#221E17] border border-[#373226] rounded-[14px] px-5 py-[15px] text-[0.92rem] font-semibold">
                <span>Angi</span>
                <span className="text-[0.78rem] text-[#8FBF9A] font-bold">Qualified · 38s</span>
              </div>
              <div className="flex justify-between items-center bg-[#221E17] border border-[#373226] rounded-[14px] px-5 py-[15px] text-[0.92rem] font-semibold">
                <span>Thumbtack</span>
                <span className="text-[0.78rem] text-[#8FBF9A] font-bold">SMS sent · 9s</span>
              </div>
              <div className="flex justify-between items-center bg-[#221E17] border border-[#373226] rounded-[14px] px-5 py-[15px] text-[0.92rem] font-semibold">
                <span>Facebook</span>
                <span className="text-[0.78rem] text-[#8FBF9A] font-bold">Booked · 2m</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[72px] text-center">
        <div className="wrap">
          <p className="text-[0.76rem] tracking-[0.14em] uppercase text-muted font-semibold mb-[22px]">
            Plugs into the tools you already run on
          </p>
          <div className="flex flex-wrap justify-center gap-[14px_34px] font-bold text-[1.05rem] text-[#A39D8E] dark:text-gray-400">
            {['ServiceTitan', 'Housecall Pro', 'Jobber', 'FieldEdge', 'Service Fusion', 'HubSpot', 'Salesforce', '+ more'].map((name, i) => (
              <span key={i} className="hover:text-ink transition-colors cursor-default">{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[88px] max-lg:py-[72px]">
        <div className="wrap">
          <div className="bg-white dark:bg-gray-800 border border-line rounded-2xl p-8 lg:p-10 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-[clamp(1.4rem,2.5vw,1.8rem)] font-extrabold tracking-[-0.03em] text-ink mb-6 border-b border-line pb-4">
                What's Your Dormant Lead Database Worth?
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div>
                  <h2 className="text-[clamp(1.4rem,2.5vw,1.8rem)] font-extrabold tracking-[-0.03em] text-ink mb-4">
                    The math makes this a <span className="text-accent">no-brainer.</span>
                  </h2>
                  <p className="text-muted mb-8 font-light leading-relaxed">
                    Unlike cheap lead gen where you fight over shared contacts, this is your exclusive data. See what just a 2% reactivation rate could mean for your bottom line this month.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                      <div className="bg-accent/20 p-1 rounded-full">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-muted">Zero ad spend required.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-accent/20 p-1 rounded-full">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-muted">Exclusive leads (they already know your brand).</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-accent/20 p-1 rounded-full">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-muted">Massive profit margins per job.</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-muted mb-2">Dead Leads in Database</label>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="100"
                      value={calcLeads}
                      onChange={(e) => setCalcLeads(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <div className="text-right font-mono font-bold text-accent mt-1">{calcLeads.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-muted mb-2">Average Job Value ($)</label>
                    <input
                      type="range"
                      min="5000"
                      max="30000"
                      step="1000"
                      value={calcJobValue}
                      onChange={(e) => setCalcJobValue(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <div className="text-right font-mono font-bold text-accent mt-1">${calcJobValue.toLocaleString()}</div>
                  </div>
                  <div className="bg-cream dark:bg-gray-900 p-6 lg:p-8 rounded-xl text-center border border-line">
                    <p className="text-sm text-muted font-semibold mb-1 uppercase tracking-wide">Projected Recovered Revenue</p>
                    <p className="text-sm text-muted/60 mb-3">(assuming conservative 1% close rate)</p>
                    <div className="text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold text-accent leading-none">
                      ${(calcLeads * calcJobValue * 0.01).toLocaleString()}
                    </div>
                  </div>
                </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section id="pilot" className="py-0">
        <div className="wrap">
          <div className="bg-dark text-[#F5F2E9] rounded-[28px] p-16 max-lg:p-[44px_28px] grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <Eyebrow dark>Free 14-Day Pilot · Limited spots per market</Eyebrow>
              <h2 className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] text-white mt-[18px] mb-[14px]">
                Hand us your 500 coldest leads.
              </h2>
              <p className="text-[1.13rem] text-[#B7B1A4] max-w-[56ch]">
                If you don't get at least 3 qualified responses in 14 days, you pay nothing. No contracts. No setup fees. No risk.
              </p>
              <ul className="list-none mt-[26px] flex flex-col gap-3">
                <li className="flex gap-3 items-start text-[0.95rem]">
                  <CheckIcon />
                  Zero-risk guarantee — results or it's free
                </li>
                <li className="flex gap-3 items-start text-[0.95rem]">
                  <CheckIcon />
                  Works with your existing CRM — nothing to migrate
                </li>
                <li className="flex gap-3 items-start text-[0.95rem]">
                  <CheckIcon />
                  You keep every lead we reactivate
                </li>
              </ul>
            </div>
            <div className="bg-[#221E17] border border-[#373226] rounded-[20px] p-9 text-center">
              <div className="text-[1.4rem] font-extrabold tracking-[-0.02em] mb-2 text-white">Ready when you are.</div>
              <p className="text-[0.88rem] text-[#B7B1A4] mb-6">Spots are limited so we can protect your market from competitors.</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const data = new FormData(form);
                  const payload = Object.fromEntries(data);
                  const res = await fetch('https://formsubmit.co/ajax/obi@devobi.com', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  if (res.ok) setSubmitted(true);
                }}
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="w-full rounded-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-[#373226] text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  required
                  className="w-full rounded-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-[#373226] text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                <input
                  type="text"
                  name="industry"
                  placeholder="Your industry — roofing, solar, HVAC, etc."
                  required
                  className="w-full rounded-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-[#373226] text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                <select
                  name="leads"
                  required
                  defaultValue=""
                  className="w-full rounded-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-[#373226] text-ink outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                >
                  <option value="" disabled>How many dormant leads do you have?</option>
                  <option value="50-100">50–100 leads</option>
                  <option value="100-500">100–500 leads</option>
                  <option value="500-1000">500–1,000 leads</option>
                  <option value="1000+">1,000+ leads</option>
                </select>
                {submitted ? (
                  <p className="text-green-600 dark:text-green-400 text-[0.9rem] font-medium">Thanks! We'll be in touch within 24 hours.</p>
                ) : (
                  <button type="submit" className="font-semibold text-[0.95rem] rounded-full px-[26px] py-[13px] bg-accent text-white hover:bg-accent-dark transition-colors w-full">
                    Apply for the Pilot →
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;