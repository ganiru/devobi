import React, { useState, useMemo } from 'react';
import AuthGate from './AuthGate';

const SEND_MAIL_API = '/api/send-mail';

/**
 * SendMail component
 * A private email composition form with live HTML preview.
 * Protected by a passphrase gate so only the owner can use it.
 */
const SendMail: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        message: '',
    });

    // Convert plain text message to formatted HTML paragraphs
    const messageBodyHtml = useMemo(() => {
        const lines = formData.message
            .split('\n')
            .map(line => {
                // Escape HTML entities
                const escaped = line
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                // Convert **bold** to <strong>
                const bolded = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Convert *italic* to <em>
                const italicized = bolded.replace(/\*(.*?)\*/g, '<em>$1</em>');
                // Convert [text](url) to <a>
                const linked = italicized.replace(
                    /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
                    '<a href="$2" style="color:#34d399;text-decoration:underline;">$1</a>'
                );
                return linked;
            });

        // Group into paragraphs (split on empty lines)
        const paragraphs: string[] = [];
        let current: string[] = [];
        for (const line of lines) {
            if (line.trim() === '') {
                if (current.length > 0) {
                    paragraphs.push(current.join('<br/>'));
                    current = [];
                }
            } else {
                current.push(line);
            }
        }
        if (current.length > 0) {
            paragraphs.push(current.join('<br/>'));
        }

        return paragraphs
            .map(p => `<p style="margin:0 0 16px 0;line-height:1.7;">${p}</p>`)
            .join('');
    }, [formData.message]);

    // Full HTML document for iframe preview
    const htmlPreview = useMemo(() => {
        return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:32px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;color:#e2e2e2;background:#111;">
  <div style="max-width:600px;margin:0 auto;background:#1a1a1a;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
    <div style="padding:24px 28px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
      <h2 style="margin:0;font-size:20px;font-weight:700;color:#fff;">${formData.subject || 'Subject'}</h2>
    </div>
    <div style="padding:28px;">
      ${messageBodyHtml || '<p style="color:#666;font-style:italic;">Start typing your message…</p>'}
    </div>
    <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
      <p style="margin:0;font-size:12px;color:#555;">Sent from Devobi</p>
    </div>
  </div>
</body>
</html>`.trim();
    }, [messageBodyHtml, formData.subject]);

    // Simplified HTML fragment for sending (no html/head/body wrapper)
    const htmlMessage = useMemo(() => {
        return `<div>
  ${messageBodyHtml}
</div>`.trim();
    }, [messageBodyHtml]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch(SEND_MAIL_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: formData.to,
                    subject: formData.subject,
                    html: htmlMessage,
                    text: formData.message,
                }),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ to: '', subject: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Send error:', error);
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ── Render ──
    return (
        <AuthGate>
            {status === 'success' ? (
                <main className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
                    <div className="glass p-12 rounded-3xl max-w-xl mx-auto text-center border border-emerald-500/30 shadow-2xl">
                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-emerald-500/10">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold mb-4 text-white">Email Sent!</h3>
                        <p className="text-gray-400 text-lg mb-8 max-w-sm mx-auto">
                            Your message has been dispatched successfully.
                        </p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-emerald-400 font-semibold transition-all cursor-pointer"
                        >
                            Compose Another
                        </button>
                    </div>
                </main>
            ) : (
                <main className="min-h-screen pt-32 pb-16 px-6">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                                Send Mail
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Compose and preview your email before sending
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {/* ── Compose Form ── */}
                            <form onSubmit={handleSubmit} className="glass p-8 md:p-10 shadow-2xl space-y-6 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-white">Compose</h2>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label htmlFor="sendmail-to" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                            To
                                        </label>
                                        <input
                                            id="sendmail-to"
                                            name="to"
                                            type="email"
                                            required
                                            value={formData.to}
                                            onChange={handleChange}
                                            placeholder="recipient@example.com"
                                            className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-emerald-500 outline-none transition-all text-white placeholder-gray-600"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="sendmail-subject" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                            Subject
                                        </label>
                                        <input
                                            id="sendmail-subject"
                                            name="subject"
                                            type="text"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Email subject line"
                                            className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-emerald-500 outline-none transition-all text-white placeholder-gray-600"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="sendmail-message" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                            Message
                                        </label>
                                        <p className="text-[11px] text-gray-600 ml-1">
                                            Supports **bold**, *italic*, and [link text](url) formatting
                                        </p>
                                        <textarea
                                            id="sendmail-message"
                                            name="message"
                                            required
                                            rows={12}
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Write your email message here..."
                                            className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-emerald-500 outline-none transition-all resize-none text-white placeholder-gray-600 font-mono text-sm leading-relaxed"
                                        />
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <p className="text-red-400 text-sm text-center font-medium">
                                            Failed to send. Please check your connection and try again.
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={`w-full py-4 font-bold text-black text-base rounded-xl transition-all transform active:scale-[0.98] relative overflow-hidden group ${status === 'loading'
                                        ? 'bg-emerald-600 cursor-not-allowed'
                                        : 'bg-emerald-400 hover:bg-emerald-300 shadow-[0_10px_30px_rgba(52,211,153,0.15)]'
                                        }`}
                                >
                                    <span className={`flex items-center justify-center transition-all ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}>
                                        Send Email
                                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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

                            {/* ── Live Preview ── */}
                            <div className="glass rounded-2xl border border-white/5 shadow-2xl overflow-hidden sticky top-32">
                                <div className="flex items-center gap-3 px-8 py-5 border-b border-white/5">
                                    <div className="w-8 h-8 bg-violet-500/10 text-violet-400 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-white">Preview</h2>
                                    <span className="ml-auto text-[11px] text-gray-600 uppercase tracking-widest font-bold">HTML Email</span>
                                </div>
                                <div className="p-4">
                                    <iframe
                                        id="sendmail-preview-frame"
                                        title="Email Preview"
                                        srcDoc={htmlPreview}
                                        className="w-full rounded-lg border border-white/5"
                                        style={{ minHeight: '480px', background: '#111' }}
                                        sandbox=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </AuthGate>
    );
};

export default SendMail;
