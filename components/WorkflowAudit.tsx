import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkflowAudit: React.FC = () => {
    const navigate = useNavigate();
    const [selectedBottleneck, setSelectedBottleneck] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation?utm_source=workflowaudit&utm_campaign=audit_launch";
    const FORMSUBMIT_URL = "https://formsubmit.co/ajax/obi@devobi.com";
    const VIMEO_LINK = "https://vimeo.com/1174179749?utm_source=devobi_website&utm_medium=audit_page";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Honeypot check
        if (formData.get("_honey")) {
            console.warn("Spam detected");
            return;
        }

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
                    Free Workflow Audit
                </h1>
                <p className="text-lg text-gray-400 text-center mb-6 max-w-2xl mx-auto">
                    Get a personalized 15-minute technical review of your lead qualification process.
                    No pitch — just actionable n8n workflow advice.
                </p>
                <div className="mb-4 text-center">
                    <a
                        href={VIMEO_LINK}
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
                        <h3 className="text-2xl font-bold text-emerald-500">Thank you!</h3>
                        <p className="text-gray-400 mt-6">
                            <a
                                href={CALENDLY_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-sm text-lg font-bold transition-all transform active:scale-95"
                            >
                                Schedule a free 15-minute call
                            </a>
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="aspect-video max-w-2xl mx-auto rounded-xl overflow-hidden border border-white/10 mb-8"
                            style={{ padding: "56.25% 0 0 0", position: "relative" }}
                        >
                            <iframe
                                src="https://player.vimeo.com/video/1174179749?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}
                                title="Lead Qualification Demo"
                            ></iframe>
                        </div>
                        <script src="https://player.vimeo.com/api/player.js"></script>
                        {/* What You Get */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
                            <h2 className="font-semibold text-lg mb-4 text-center">You'll get:</h2>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 mt-1">✓</span>
                                    <span>A live walkthrough of a sample lead-scoring workflow</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 mt-1">✓</span>
                                    <span>2-3 specific recommendations for your CRM + lead sources</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 mt-1">✓</span>
                                    <span>A sanitized n8n JSON template you can import immediately</span>
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
                                <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Primary CRM</label>
                                <input
                                    type="text"
                                    name="crm"
                                    placeholder="Follow Up Boss, LionDesk, etc."
                                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">What's your biggest bottleneck?</label>
                                <select
                                    name="bottleneck"
                                    value={selectedBottleneck}
                                    onChange={(e) => setSelectedBottleneck(e.target.value)}
                                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all"
                                >
                                    <option value="" className="bg-gray-900">Select one...</option>
                                    <option value="cold-leads" className="bg-gray-900">Leads go cold before I call</option>
                                    <option value="unqualified" className="bg-gray-900">Too many unqualified leads</option>
                                    <option value="crm-sync" className="bg-gray-900">CRM sync issues</option>
                                    <option value="other" className="bg-gray-900">Other</option>
                                </select>
                                {selectedBottleneck === 'other' && (
                                    <textarea
                                        rows={4}
                                        name="message"
                                        placeholder="Tell us more..."
                                        className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all resize-none mt-2"
                                    ></textarea>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!selectedBottleneck || isLoading}
                                className="md:col-span-2 cursor-pointer bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black py-4 rounded-sm font-bold text-lg transition-all"
                            >
                                {isLoading ? "Submitting..." : "Submit"}
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
                            After submitting, you'll get instant access to book your 15-min technical walkthrough.
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

export default WorkflowAudit;

