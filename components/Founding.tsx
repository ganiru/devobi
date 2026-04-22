import React from 'react';
import { Link } from 'react-router-dom';

const Founding: React.FC = () => {
    const tiers = [
        {
            name: "Founding Member",
            price: "$497",
            setup: "Setup fee: WAIVED",
            audience: "Solo Agents",
            features: [
                "AI Lead Capture + SMS Automation",
                "Automated follow-up sequences",
                "CRM sync (Follow Up Boss, LionDesk, etc.)",
                "Email + SMS notifications",
                "Weekly performance summary"
            ],
            cta: "Start with Free Pilot",
            badge: "Limited to 10 spots",
            highlighted: true
        },
        {
            name: "VelociLead Pro",
            price: "$997",
            setup: "$497 setup fee",
            audience: "Active Agents (2-5 closings/month)",
            features: [
                "Everything in Founding Member",
                "AI Qualification Engine",
                "Calendar sync (auto-booking)",
                "Lead scoring & routing",
                "Priority support",
                "Custom workflow tweaks"
            ],
            cta: "Start with Free Pilot",
            badge: null,
            highlighted: false
        },
        {
            name: "Performance Partner",
            price: "$1,997+",
            setup: "Custom setup fee",
            audience: "Teams, Brokerages, High-Volume Agents",
            features: [
                "Everything in VelociLead Pro",
                "Unlimited leads processed",
                "$50 success fee per qualified appointment",
                "Dedicated automation engineer",
                "Custom integrations",
                "White-glove onboarding"
            ],
            cta: "Book Strategy Call",
            badge: null,
            highlighted: false
        }
    ];

    return (
        <main className="min-h-screen pt-32 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing That Scales With You</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        From solo agents just starting out to enterprise brokerages running at volume — we have a tier that fits.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        All tiers include a free 14-day pilot (DFW only)
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {tiers.map((tier, idx) => (
                        <div 
                            key={idx} 
                            className={`relative p-8 rounded-lg border ${
                                tier.highlighted 
                                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                                    : 'border-white/10 bg-white/5'
                            } flex flex-col`}
                        >
                            {tier.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full">
                                    {tier.badge}
                                </div>
                            )}
                            
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-4xl font-bold text-emerald-500">{tier.price}</span>
                                    <span className="text-gray-500">/month</span>
                                </div>
                                <p className="text-sm text-gray-400">{tier.setup}</p>
                            </div>

                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{tier.audience}</p>
                            </div>

                            <ul className="mb-8 space-y-3 flex-grow">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={tier.cta.includes("Strategy") ? "https://calendly.com/obinnae/ai-consultation" : "/workflow-audit"}
                                onClick={() => window.scrollTo(0, 0)}
                                className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all ${
                                    tier.highlighted
                                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                }`}
                            >
                                {tier.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* FAQ / Notes Section */}
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="p-6 glass rounded-lg">
                        <h4 className="font-bold mb-2">Not ready to commit?</h4>
                        <p className="text-gray-400 text-sm">
                            Start with a free 14-day pilot on the Lead Reactivation Engine. We'll process your old database and show you exactly what we can do. 
                            If you don't get at least 3 qualified responses, you pay nothing.
                        </p>
                    </div>

                    <div className="p-6 glass rounded-lg">
                        <h4 className="font-bold mb-2">What's included in setup?</h4>
                        <p className="text-gray-400 text-sm">
                            CRM integration, workflow configuration, email domain setup (via your own Mailgun/SendGrid account), and testing. 
                            Most setups are complete within 2 weeks.
                        </p>
                    </div>

                    <div className="p-6 glass rounded-lg">
                        <h4 className="font-bold mb-2">Can I switch tiers later?</h4>
                        <p className="text-gray-400 text-sm">
                            Absolutely. Start small and scale up as your volume grows. We'll migrate your workflows with zero downtime.
                        </p>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <Link
                        to="/workflow-audit"
                        onClick={() => window.scrollTo(0, 0)}
                        className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20"
                    >
                        Apply for Free 14-Day Pilot →
                    </Link>
                    <p className="mt-4 text-sm text-gray-500">DFW agents only • Limited spots available</p>
                </div>
            </div>
        </main>
    );
};

export default Founding;
