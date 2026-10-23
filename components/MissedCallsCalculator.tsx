import React, { useState } from 'react';

/**
 * "What are missed calls costing you?" calculator for AI voice agents.
 *
 * Sibling to RevenueCalculator (lead reactivation). This one models a
 * different product: every unanswered call is a potential booked job. Inputs
 * are missed calls per month + average job value; outputs are the estimated
 * number of jobs Aura could book and the recovered revenue.
 *
 * Kept separate from RevenueCalculator on purpose — different input semantics
 * (missed calls vs dormant leads), different conversion rates (booking rate
 * vs reactivation close rate), and different page copy. If a third calculator
 * ever appears, extract the shared slider/result markup into a primitive.
 */

export type MissedCallsCalculatorProps = {
  /** Heading shown above the whole card. */
  title?: string;
  /** Left-column headline (can contain JSX, e.g. <span> emphasis). */
  headline?: React.ReactNode;
  /** Paragraph under the headline. */
  description?: React.ReactNode;
  /** Checklist items rendered as bullet points. */
  bullets?: string[];
  /** Starting value for the "missed calls per month" slider. */
  defaultMissedCalls?: number;
  /** Starting value for the "average job value" slider. */
  defaultJobValue?: number;
  /** Fraction of missed callers who would have booked (0.25 = 25%). */
  bookingRate?: number;
  /** Label for the first slider. */
  missedCallsLabel?: string;
  /** Label for the second slider. */
  jobValueLabel?: string;
  /** Headline inside the revenue result box. */
  resultLabel?: string;
  /** Fine print under the result headline. */
  resultFootnote?: React.ReactNode;
};

const CheckIcon = () => (
  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function MissedCallsCalculator({
  title = 'What Are Missed Calls Costing You?',
  headline = (
    <>
      Every call you miss is a job <span className="text-accent">someone else books.</span>
    </>
  ),
  description = 'Voicemails and busy signals are jobs walking to the contractor down the street. See what answering every call — nights, weekends, mid-job — could be worth this month.',
  bullets = [
    'Aura answers every call, day or night.',
    'Booked jobs your voicemail would have lost.',
    'No more playing phone tag with emergencies.',
  ],
  defaultMissedCalls = 25,
  defaultJobValue = 1500,
  bookingRate = 0.25,
  missedCallsLabel = 'Missed Calls per Month',
  jobValueLabel = 'Average Job Value ($)',
  resultLabel = 'Potential Recovered Revenue',
  resultFootnote = (
    <>
      assuming ~{Math.round(bookingRate * 100)}% of missed callers would book
    </>
  ),
}: MissedCallsCalculatorProps) {
  // Self-contained state: each instance tracks its own sliders.
  const [missedCalls, setMissedCalls] = useState(defaultMissedCalls);
  const [calcJobValue, setCalcJobValue] = useState(defaultJobValue);

  const jobsBooked = Math.round(missedCalls * bookingRate);
  const projected = missedCalls * calcJobValue * bookingRate;

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
                  <label className="block text-sm font-semibold text-muted mb-2">{missedCallsLabel}</label>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={missedCalls}
                    onChange={(e) => setMissedCalls(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="text-right font-mono font-bold text-accent mt-1">{missedCalls.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted mb-2">{jobValueLabel}</label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
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
                  <p className="mt-3 text-sm font-semibold text-muted">
                    ≈ {jobsBooked.toLocaleString()} {jobsBooked === 1 ? 'job' : 'jobs'} booked every month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
