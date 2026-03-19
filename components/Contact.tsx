import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Automate Your Biggest Time-Waster?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Get a free workflow audit + personalized n8n automation strategy for your real estate business.
        </p>

        <Link
          to="/workflow-audit?utm_source=contact&utm_campaign=audit_launch"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex cursor-pointer items-center justify-center px-8 py-4 text-base font-semibold text-black bg-emerald-400 rounded-xl hover:bg-emerald-300 transition-colors"
        >
          Get Your Free Workflow Audit →
        </Link>

        <p className="mt-4 text-sm text-gray-500">
          ✓ 15-minute technical review &nbsp;•&nbsp;
          ✓ No pitch, just advice &nbsp;•&nbsp;
          ✓ Works with your CRM
        </p>
        <div className="mt-8">
          <Link 
            to="/founding" 
            className="px-6 py-3 mt-8 bg-white/10 text-emerald-400 font-semibold rounded-lg hover:bg-white/20 transition border border-emerald-400/30"
            style={{ zIndex: 1 }}
          >
            View Founding Member Pricing
          </Link>
        </div>
      </div>
    </section>

  );
};

export default Contact;
