import React, { useState } from 'react';

/**
 * Interactive "What's your dormant lead database worth?" calculator.
 *
 * A self-contained, reusable revenue projection widget. Drop it anywhere in the
 * main Tailwind app (components/). Sub-apps (plumber/, medspa/) use a different
 * styling system (plain CSS, no Tailwind), so they can't consume this directly —
 * but the calculation logic and defaults are trivial to replicate there.
 *
 * All copy is configurable via props so pages can tailor the messaging without
 * touching the widget internals.
 */

export type RevenueCalculatorProps = {
  /** Heading shown above the whole card. */
  title?: string;
  /** Left-column headline (can contain JSX, e.g. <span> emphasis). */
  headline?: React.ReactNode;
  /** Paragraph under the headline. */
  description?: React.ReactNode;
  /** Checklist items rendered as bullet points. */
  bullets?: string[];
  /** Initial (and controlled-if-desired) value for "dead leads". */
  defaultLeads?: number;
  /** Initial (and controlled-if-desired) value for "average job value". */
  defaultJobValue?: number;
  /** Projected-close / reactivation rate applied to leads × job value. */
  closeRate?: number;
  /** Label for the first slider. */
  leadsLabel?: string;
  /** Label for the second slider. */
  jobValueLabel?: string;
  /** Headline inside the revenue result box. */
  resultLabel?: string;
  /** Fine print under the result headline. */
  resultFootnote?: string;
};

const CheckIcon = () => (
  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function RevenueCalculator({
  title = "What's Your Dormant Lead Database Worth?",
  headline = (
    <>
      The math makes this a <span className="text-accent">no-brainer.</span>
    </>
  ),
  description = 'Unlike cheap lead gen where you fight over shared contacts, this is your exclusive data. See what just a 2% reactivation rate could mean for your bottom line this month.',
  bullets = [
    'Zero ad spend required.',
    'Exclusive leads (they already know your brand).',
    'Massive profit margins per job.',
  ],
  defaultLeads = 2000,
  defaultJobValue = 15000,
  closeRate = 0.01,
  leadsLabel = 'Dead Leads in Database',
  jobValueLabel = 'Average Job Value ($)',
  resultLabel = 'Projected Recovered Revenue',
  resultFootnote = '(assuming conservative 1% close rate)',
}: RevenueCalculatorProps) {
  // Sliders are self-contained: each page that renders this component gets its
  // own local state, so multiple calculators never share values.
  const [calcLeads, setCalcLeads] = useState(defaultLeads);
  const [calcJobValue, setCalcJobValue] = useState(defaultJobValue);

  const projected = calcLeads * calcJobValue * closeRate;
  const closePct = Math.round(closeRate * 100);

  return (
    <section className="py-[88px] max-lg:py-[72px]">
      <div className="wrap">
        <div className="bg-white dark:bg-gray-800 border border-line rounded-2xl p-8 lg:p-10 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[clamp(1.4rem,2.5vw,1.8rem)] font-extrabold tracking-[-0.03em] text-ink mb-6 border-b border-line pb-4">
              {title}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-[clamp(1.4rem,2.5vw,1.8rem)] font-extrabold tracking-[-0.03em] text-ink mb-4">
                  {headline}
                </h2>
                <p className="text-muted mb-8 font-light leading-relaxed">
                  {description}
                </p>
                <ul className="space-y-4 mb-8">
                  {bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="bg-accent/20 p-1 rounded-full">
                        <CheckIcon />
                      </div>
                      <span className="text-sm text-muted">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-muted mb-2">{leadsLabel}</label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={calcLeads}
                    onChange={(e) => setCalcLeads(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="text-right font-mono font-bold text-accent mt-1">{calcLeads.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted mb-2">{jobValueLabel}</label>
                  <input
                    type="range"
                    min="1000"
                    max="30000"
                    step="1000"
                    value={calcJobValue}
                    onChange={(e) => setCalcJobValue(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="text-right font-mono font-bold text-accent mt-1">${calcJobValue.toLocaleString()}</div>
                </div>
                <div className="bg-cream dark:bg-gray-900 p-6 lg:p-8 rounded-xl text-center border border-line">
                  <p className="text-sm text-muted font-semibold mb-1 uppercase tracking-wide">{resultLabel}</p>
                  <p className="text-sm text-muted/60 mb-3">{resultFootnote}</p>
                  <div className="text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold text-accent leading-none">
                    ${projected.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
