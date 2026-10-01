import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FreePilot: React.FC = () => {
    const navigate = useNavigate();
    const [selectedLeads, setSelectedLeads] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation?utm_source=free_pilot&utm_campaign=pilot_launch";
    const SEND_MAIL_URL = "/api/send-mail";
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

        const name = String(formData.get("name") || "");
        const email = String(formData.get("email") || "");
        const leadCount = String(formData.get("lead_count") || "");

        setIsLoading(true);

        try {
            const response = await fetch(SEND_MAIL_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: "obi@devobi.com",
                    subject: "New Free Pilot Application",
                    text: [
                        `Name: ${name}`,
                        `Email: ${email}`,
                        `Dormant leads: ${leadCount}`,
                    ].join("\n"),
                    html: `<div>
                        <h2>New Free Pilot Application</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Dormant leads:</strong> ${leadCount}</p>
                    </div>`,
                }),
            });
            if (response.ok) {
                setSubmitted(true);
                // Send the user a calendar invite or link to schedule a meeting
                const calendarInviteLink = `https://calendly.com/obinnae/ai-consultation`;
                await fetch('/api/send-mail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: email,
                        subject: 'Your Free Pilot Meeting Invite',
                        text: `Hi ${name},\n\nThank you for your interest in our free pilot. 
The next step is a quick 30-minute consultation call. We'll go over how you currently handle leads, see where dormant contacts might be turning into missed revenue, and figure out whether the pilot is a good fit for you.
You can pick a time that works best for you here: ${calendarInviteLink}
If none of the available slots work, just reply to this email and we'll find a time that does.
Looking forward to talking with you.`,
                        html: `<div>
                            Hi ${name},
                            <p>Thanks for submitting a Free Pilot request for our Lead Reactivation workflow. I'm excited to learn more about your business.</p>
                            <p>The next step is a quick 30-minute consultation call. We'll go over how you currently handle leads, see where dormant contacts might be turning into missed revenue, and figure out whether the pilot is a good fit for you.</p>
                            <p>You can pick a time that works best for you here: <a href='${CALENDLY_LINK}' target="_blank" rel="noopener noreferrer">${calendarInviteLink}</a></p>
                            <p>If none of the available slots work, just reply to this email and we'll find a time that does.</p>
                            <p>Looking forward to talking with you.</p>
                        </div>`,
                    }),
                }).catch((error) => {
                    console.error('Error sending calendar invite:', error);
                });
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
                        <h3 className="text-2xl font-bold text-accent mb-4">We've received your submission!</h3>
                        <h5 className="text-accent">You should be receiving a meeting invite shortly. Please check your spam and trash folders as well.</h5>
                    </div>
                ) : (
                    <div>
                        {/* Loom Video Embed */}
                        <div className="max-w-2xl mx-auto rounded-md overflow-hidden border border-line mb-8" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                src="https://www.loom.com/embed/5dc35d7b0eea47bab5269cc35c6539ea"
                                frameBorder="0"
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                title="Free 14-Day Pilot Demo"
                            ></iframe>
                        </div>

                        {/* What You Get + Short Form — side by side on desktop, stacked on mobile */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* What You Get */}
                        <div className="bg-white dark:bg-gray-800 border border-line rounded-md p-6">
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
                                    className="w-full px-5 py-[13px] text-[0.95rem] bg-transparent dark:bg-black/20 border border-line text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-muted tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="john@abcroofing.com"
                                    className="w-full px-5 py-[13px] text-[0.95rem] bg-transparent dark:bg-black/20 border border-line text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all"
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
                                    className="w-full px-5 py-[13px] text-[0.95rem] bg-transparent dark:bg-black/20 border border-line text-ink outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
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
                                className="md:col-span-2 cursor-pointer font-semibold text-[0.95rem] no-underline px-[26px] py-[13px] bg-accent text-white hover:bg-accent-dark disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors w-full"
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
                        </div>
                        {/* Post-submit note */}
                        <p className="mt-6 text-sm text-muted/60 text-center">
                            After applying, you'll get a notification to schedule your kickoff call and we'll set up your pilot within 5-7 days.
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
