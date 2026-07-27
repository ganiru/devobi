import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FreePilot: React.FC = () => {
    const navigate = useNavigate();
    const [selectedLeads, setSelectedLeads] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation?utm_source=free_pilot&utm_campaign=pilot_launch";
    const FORMSUBMIT_URL = "https://formsubmit.co/ajax/obi@devobi.com";
    const LOOM_LINK = "https://www.loom.com/share/5dc35d7b0eea47bab5269cc35c6539ea";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Honeypot check
        if (formData.get("_honey")) {
            console.warn("Spam detected");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(FORMSUBMIT_URL, {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                setSubmitted(true);
                form.reset();
            } else {
                setError("Something went wrong. Please try again or email us directly.");
            }
        } catch (error) {
            setError("Connection failed. Please check your internet and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-[68px] bg-cream text-ink font-sans antialiased">
      <section className="py-[88px] max-lg:py-[72px]">
        <div className="wrap">
                {/* Header */}
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                    Start Your Free 14-Day Pilot
                </h1>
                <p className="text-lg text-muted text-center mb-6 max-w-2xl mx-auto">
                    We'll run our Lead Reactivation Engine on your dormant lead list for 14 days at no cost.
                    No setup fee, no commitment — just watch it work before deciding anything.
                </p>
                <div className="mb-4 text-center">
                    <a
                        href={LOOM_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-accent hover:text-accent-dark text-sm font-medium transition-colors"
                    >
                        <span>🎥</span>
                        Watch demo in new tab
                    </a>
                </div>
                {submitted ? (
                    <div className="text-center py-12">
                        <h3 className="text-2xl font-bold text-accent">Application received!</h3>
                        <p className="text-muted mt-6">
                            <a
                                href={CALENDLY_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] bg-accent text-white hover:bg-accent-dark transition-colors"
                            >
                                Schedule your kickoff call
                            </a>
                        </p>
                    </div>
                ) : (
                    <div>
                        {/* Loom Video Embed */}
                        <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-line mb-8" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                src="https://www.loom.com/embed/5dc35d7b0eea47bab5269cc35c6539ea"
                                frameBorder="0"
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                title="Free 14-Day Pilot Demo"
                            ></iframe>
                        </div>

                        {/* What You Get */}
                        <div className="bg-white dark:bg-gray-800 border border-line rounded-2xl p-6 mb-10">
                            <h2 className="font-semibold text-lg mb-4 text-center text-ink">You'll get:</h2>
                            <ul className="space-y-3 text-muted">
                                <li className="flex items-start gap-3">
                                    <span className="text-accent mt-1">✓</span>
                                    <span>Your old leads getting re-engaged automatically — see real responses happen in real time</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-accent mt-1">✓</span>
                                    <span>At least 3 qualified responses from your database — or you pay nothing</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-accent mt-1">✓</span>
                                    <span>A quick recap call after the pilot to review results and next steps</span>
                                </li>
                            </ul>
                        </div>

                        {/* Short Form */}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="_honey" style={{ display: 'none' }} />
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-muted tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="John Doe"
                                    className="w-full rounded-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-line text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-muted tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="john@abcroofing.com"
                                    className="w-full rounded-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-line text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs uppercase font-bold text-muted tracking-wider">
                                    Approximately how many dormant/old leads do you have?
                                </label>
                                <select
                                    name="lead_count"
                                    value={selectedLeads}
                                    onChange={(e) => setSelectedLeads(e.target.value)}
                                    required
                                    className="w-full rounded-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-line text-ink outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                                >
                                    <option value="" className="bg-white dark:bg-gray-800">Select a range...</option>
                                    <option value="50-100" className="bg-white dark:bg-gray-800">50 – 100 leads</option>
                                    <option value="100-500" className="bg-white dark:bg-gray-800">100 – 500 leads</option>
                                    <option value="500-1000" className="bg-white dark:bg-gray-800">500 – 1,000 leads</option>
                                    <option value="1000+" className="bg-white dark:bg-gray-800">1,000+ leads</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={!selectedLeads || isLoading}
                                className="md:col-span-2 cursor-pointer font-semibold text-[0.95rem] no-underline rounded-full px-[26px] py-[13px] bg-accent text-white hover:bg-accent-dark disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors w-full"
                            >
                                {isLoading ? "Submitting..." : "Apply for Free Pilot"}
                            </button>
                            {error && (
                                <p className="md:col-span-2 text-center text-sm text-red-400 mt-2">
                                    {error}
                                </p>
                            )}
                            <p className="md:col-span-2 text-center text-xs text-muted/60">
                                We respect your privacy. Your information is never shared or sold.
                            </p>
                        </form>
                        {/* Post-submit note */}
                        <p className="mt-6 text-sm text-muted/60 text-center">
                            After applying, you'll get access to schedule your kickoff call and we'll set up your pilot within 5-7 days.
                        </p>
                    </div>
                )}

                {/* Back link */}
                <div className="mt-10 text-center">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                            window.scrollTo(0, 0);
                        }}
                        className="text-muted hover:text-ink transition-colors text-sm font-medium"
                    >
                        ← Back to home
                    </button>
                </div>
            </div>
            </section>
        </main>
    );
};

export default FreePilot;
