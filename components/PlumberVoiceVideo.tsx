import React from 'react';
import PlumberPilotForm from './PlumberPilotForm';

/**
 * Displays the plumber voice agent demo and pilot contact form.
 */
const PlumberVoiceVideo: React.FC = () => {
    return (
        <section className="min-h-screen pt-32 pb-16 px-6 relative flex flex-col items-center overflow-hidden">
            {/* Background Decorative Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[10%] left-[-15%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[10%] right-[-15%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="w-full max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-8">
                <header className="max-w-2xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink mb-4">
                        See how Aura handles a plumbing call
                    </h1>
                    <p className="text-lg text-muted leading-relaxed">
                        Watch Aura, the 24/7 AI voice receptionist, answer an incoming plumbing call, qualify the job, and help book the next step—even while you’re busy on a job.
                    </p>
                </header>

                {/* Loom Video Embed Card */}
                <div className="w-full glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 hover:border-emerald-500/30" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                        src="https://www.loom.com/embed/d9edc08096af49ff9c06e6e53e2dcf4c"
                        frameBorder="0"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        title="Aura answering and qualifying a plumbing call"
                        className="w-full h-full"
                    ></iframe>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-ink mt-12 text-center">
                    Want to try Aura in your plumbing business?
                </h2>
                <p className="text-lg text-muted leading-relaxed mb-6 text-center">
                    Request a free 14-day pilot. We’ll follow up with a quick setup call and a link to choose a time.
                </p>
                <div className="w-full max-w-2xl">
                    <PlumberPilotForm sourceUrl="https://devobi.com/plumber-voice-demo" />
                </div>
            </div>
        </section>
    );
};

export default PlumberVoiceVideo;
