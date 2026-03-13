
import React, { useState } from 'react';

const Contact: React.FC = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Automate Your Biggest Time-Waster?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Get a free workflow audit + personalized n8n automation strategy for your real estate business.
        </p>

        <a
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/workflow-audit?utm_source=contact&utm_campaign=audit_launch');
            window.dispatchEvent(new PopStateEvent('popstate'));
            window.scrollTo(0, 0);

            // Add analytics (if using Google Analytics, Plausible, etc.)
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'click', {
                event_category: 'CTA',
                event_label: 'Workflow Audit - Homepage',
              });
            }
          }}
          className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-black bg-emerald-400 rounded-xl hover:bg-emerald-300 transition-colors"
        >
          Get Your Free Workflow Audit →
        </a>

        <p className="mt-4 text-sm text-gray-500">
          ✓ 15-minute technical review &nbsp;•&nbsp;
          ✓ No pitch, just advice &nbsp;•&nbsp;
          ✓ Works with your CRM
        </p>
      </div>
    </section>

  );
};

export default Contact;
