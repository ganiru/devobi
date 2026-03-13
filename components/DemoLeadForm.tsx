import React, { useState } from 'react';

/**
 * DemoLeadForm component
 * A premium real estate lead form that posts data to an n8n webhook.
 */
const DemoLeadForm: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        source: 'Facebook'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/submit-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    source: 'Facebook'
                });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (status === 'success') {
        return (
            <main className="min-h-screen pt-32 pb-16 px-6">
                <div className="glass p-12 rounded-3xl max-w-xl mx-auto text-center border-emerald-500/30 shadow-2xl animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-emerald-500/10">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-white">Inquiry Received!</h3>
                    <p className="text-gray-400 text-lg mb-8 max-w-sm mx-auto">
                        Thanks for reaching out! One of our real estate specialists will review your details and contact you shortly.
                    </p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-emerald-400 font-semibold transition-all"
                    >
                        Send Another Inquiry
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-16 px-6">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-xl mx-auto relative z-10">
                <p className="text-center text-red-400 text-sm py-4">
                    This is just for demo purposes. Enter fake data if you wish.
                    <br />To see what the agent/broker will see when submitted, use your real email address.
                </p>
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                        Find Your Dream Home
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Tell us what you're looking for and let our experts handle the rest.
                    </p>

                </div>

                <form onSubmit={handleSubmit} className="glass p-8 md:p-10 shadow-2xl space-y-7">
                    <input type="hidden" name="source" value={formData.source} />

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Jane Cooper"
                                    className="w-full bg-black border border-white/10 p-4 focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2.5">
                                <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="jane@example.com"
                                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label htmlFor="phone" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(555) 000-0000"
                                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label htmlFor="message" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                How can I help?
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Looking for a 3-bedroom luxury villa in Downtown..."
                                className="w-full bg-black border border-white/10 p-4 focus:border-emerald-500 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>

                    {status === 'error' && (
                        <div className="py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-400 text-sm text-center font-medium">
                                Submission failed. Please check your connection and try again.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`w-full py-5 font-black text-black text-lg transition-all transform active:scale-[0.98] relative overflow-hidden group ${status === 'loading'
                            ? 'bg-emerald-600 cursor-not-allowed'
                            : 'bg-emerald-400 hover:bg-emerald-300 shadow-[0_10px_30px_rgba(52,211,153,0.2)]'
                            }`}
                    >
                        <span className={`flex items-center justify-center transition-all ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}>
                            Send Inquiry
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>

                        {status === 'loading' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default DemoLeadForm;
