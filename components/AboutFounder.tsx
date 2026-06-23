import React from 'react';

const AboutFounder: React.FC = () => {
  return (
    <section id="about" className="py-20 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Text side */}
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500/70 mb-4 block">
              Who's Behind This
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Built by a DFW Engineer,<br />
              Not a Vendor Selling Software
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              I'm Obi Ezeilo — an AI automations engineer with over 25 years of experience and a Frisco, TX native.
              I've spent the last several years building agentic AI systems that actually work in production,
              not demos that fall apart after the pitch.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              Devobi isn't a SaaS platform. It's a hands-on consultancy. When you sign up, you're working
              directly with me — I configure the workflows, I connect to your CRM, and I make sure the
              system works before you pay a dollar.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              I chose real estate because DFW agents are leaving real money on the table — not because
              they're lazy, but because following up with 200 old leads manually is humanly impossible.
              That's exactly the problem AI solves well.
            </p>

            {/* Credibility chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                '25 Years Engineering',
                'Based in Frisco, TX',
                'AI & Agentic Systems',
                'n8n · OpenAI · Gemini',
                'Devobi LLC — Founded 2024'
              ].map(chip => (
                <span key={chip} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-gray-400">
                  {chip}
                </span>
              ))}
            </div>

            <a
              href="https://calendly.com/obinnae/ai-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors"
            >
              Talk directly with Obi →
            </a>
          </div>

          {/* Visual / quote side */}
          <div className="flex flex-col gap-6">
            {/* Photo placeholder — swap with real headshot */}
            <div className="w-full aspect-square max-w-xs mx-auto md:mx-0 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-900/40 to-neutral-900 border border-white/10 flex items-center justify-center relative">
              {/* Replace this div with an <img> tag once you have a headshot */}
              <div className="text-center">
                <img src="/images/obi-headshot.png" alt="Obi Ezeilo, Founder of DevObi LLC" className="w-full h-full object-cover" />
              </div>

            </div>

            {/* Pull quote */}
            <blockquote className="glass rounded-lg p-6 border-l-2 border-emerald-500">
              <p className="text-gray-300 text-sm leading-relaxed italic">
                "Most agents have 300+ contacts sitting in their CRM that they've completely given up on.
                Those leads didn't vanish — life just got in the way. The right message, sent at the
                right time, still works. That's exactly what this system is built to do."
              </p>
              <footer className="mt-4 text-xs text-gray-500 font-semibold not-italic">— Obi Ezeilo, Founder, Devobi LLC</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFounder;
