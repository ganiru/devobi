import React from 'react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Revive Your Dead Leads?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Start with a free 14-day pilot. If you don't get at least 3 qualified responses from your old database, you pay nothing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            to="/workflow-audit?utm_source=contact&utm_campaign=pilot_launch"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex cursor-pointer items-center justify-center px-8 py-4 text-base font-semibold text-black bg-emerald-400 rounded-xl hover:bg-emerald-300 transition-colors"
          >
            Apply for Free Pilot →
          </Link>
          <Link
            to="/founding"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex cursor-pointer items-center justify-center px-8 py-4 text-base font-semibold text-white border border-white/20 rounded-xl hover:bg-white/5 transition-colors"
          >
            View Pricing
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          ✓ DFW agents only &nbsp;•&nbsp;
          ✓ Zero risk — pay nothing if it doesn't work &nbsp;•&nbsp;
          ✓ Limited spots available
        </p>
      </div>
    </section>
  );
};

export default Contact;
