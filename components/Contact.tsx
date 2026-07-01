import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: "Does this work with my CRM?",
    a: "The system is built to integrate with Follow Up Boss, LionDesk, KvCORE, HubSpot, Salesforce, Chime, Sierra Interactive, and most others via API. If you use something else, reach out — if it has an API or CSV export, we can likely work with it."
  },
  {
    q: "How long does setup take?",
    a: "Most pilots are configured and live within 5–7 business days. Obi handles all the setup — workflow configuration, email domain authentication, CRM connection, and testing. You don't touch a line of code."
  },
  {
    q: "What if I don't have many old leads?",
    a: "The pilot is designed to work with lists as small as 50 contacts. The system is built around personalization at the individual lead level, not volume. Book a call and we'll tell you honestly whether your list is a good fit before we start."
  },
  {
    q: "What if it doesn't work?",
    a: "You pay nothing. The pilot is zero-risk: if you don't get at least 3 qualified responses from your old database within 14 days, there's no charge. No invoice, no awkward conversation."
  }
];

const Contact: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="contact" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">

        {/* Main CTA */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Out What's Still in Your Database?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            We're running free 14-day pilots with select DFW agents right now. You bring the dormant 
            lead list — we run the system, you watch it work. No commitment, no setup fees, no risk.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/free-pilot?utm_source=contact&utm_campaign=pilot_launch"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex cursor-pointer items-center justify-center px-8 py-4 text-base font-semibold text-black bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Apply for Free 14-Day Pilot →
            </Link>
            <Link
              to="/founding"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex cursor-pointer items-center justify-center px-8 py-4 text-base font-semibold text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
            >
              View Pricing Plans
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            ✓ DFW agents only &nbsp;·&nbsp;
            ✓ Zero risk — pay nothing if it doesn't work &nbsp;·&nbsp;
            ✓ Limited spots available
          </p>
        </div>

        {/* FAQ — objection handling */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-8 text-gray-200">Common Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-sm text-gray-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-emerald-400 flex-shrink-0 ml-4 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Direct contact nudge */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 mb-2">Prefer to just talk it through?</p>
            <a
              href="https://calendly.com/obinnae/ai-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold underline underline-offset-4 transition-colors"
            >
              Book a 20-minute call with Obi →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
