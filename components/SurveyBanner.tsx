
import React from 'react';

const SurveyBanner: React.FC = () => {
    return (
        <div className="bg-emerald-600/10 border-b border-emerald-500/20 py-2.5 px-6 text-center group relative z-[60]">
            <a
                href="/survey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center justify-center gap-2"
            >
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] text-emerald-300 border border-emerald-500/30 uppercase tracking-widest font-bold">Research</span>
                <span>Real Estate Agents: Tell us your #1 time-waster — help us build the perfect fix.</span>
                <span className="underline underline-offset-4 group-hover:no-underline font-semibold">Take the short survey →</span>
            </a>
        </div>
    );
};

export default SurveyBanner;
