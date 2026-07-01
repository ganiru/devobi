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
        <main className="min-h-screen pt-32 pb-16 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                    Start Your Free 14-Day Pilot
                </h1>
                <p className="text-lg text-gray-400 text-center mb-6 max-w-2xl mx-auto">
                    We'll run our Lead Reactivation Engine on your dormant lead list for 14 days at no cost.
                    No setup fee, no commitment — just watch it work before deciding anything.
                </p>
                <div className="mb-4 text-center">
                    <a
                        href={LOOM_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                    >
                        <span>🎥</span>
                        Watch demo in new tab
                    </a>
                </div>
                {submitted ? (
                    <div className="text-center py-12">
                        <h3 className="text-2xl font-bold text-emerald-500">Application received!</h3>
                        <p className="text-gray-400 mt-6">
                            <a
                                href={CALENDLY_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-sm text-lg font-bold transition-all transform active:scale-95"
                            >
                                Schedule your kickoff call
                            </a>
                        </p>
                    </div>
                ) : (
                    <div>
                        {/* Loom Video Embed */}
                        <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-white/10 mb-8" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                src="https://www.loom.com/embed/5dc35d7b0eea47bab5269cc35c6539ea"
                                frameBorder="0"
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                title="Free 14-Day Pilot Demo"
                            ></iframe>
                        </div>

                        {/* What You Get */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
                            <h2 className="font-semibold text-lg mb-4 text-center">You'll get:</h2>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 mt-1">✓</span>
                                    <span>Your old leads getting re-engaged automatically — see real responses happen in real time</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 mt-1">✓</span>
                                    <span>At least 3 qualified responses from your database — or you pay nothing</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 mt-1">✓</span>
                                    <span>A quick recap call after the pilot to review results and next steps</span>
                                </li>
                            </ul>
                        </div>

                        {/* Short Form */}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="_honey" style={{ display: 'none' }} />
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="John Doe"
                                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="john@realty.com"
                                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                                    Approximately how many dormant/old leads do you have?
                                </label>
                                <select
                                    name="lead_count"
                                    value={selectedLeads}
                                    onChange={(e) => setSelectedLeads(e.target.value)}
                                    required
                                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all"
                                >
                                    <option value="" className="bg-gray-900">Select a range...</option>
                                    <option value="50-100" className="bg-gray-900">50 - 100 leads</option>
                                    <option value="100-500" className="bg-gray-900">100 - 500 leads</option>
                                    <option value="500-1000" className="bg-gray-900">500 - 1,000 leads</option>
                                    <option value="1000+" className="bg-gray-900">1,000+ leads</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={!selectedLeads || isLoading}
                                className="md:col-span-2 cursor-pointer bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black py-4 rounded-sm font-bold text-lg transition-all"
                            >
                                {isLoading ? "Submitting..." : "Apply for Free Pilot"}
                            </button>
                            {error && (
                                <p className="md:col-span-2 text-center text-sm text-red-400 mt-2">
                                    {error}
                                </p>
                            )}
                            <p className="md:col-span-2 text-center text-xs text-gray-600">
                                We respect your privacy. Your information is never shared or sold.
                            </p>
                        </form>
                        {/* Post-submit note */}
                        <p className="mt-6 text-sm text-gray-500 text-center">
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
                        className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                    >
                        ← Back to home
                    </button>
                </div>
            </div>
        </main>
    );
};

export default FreePilot;
