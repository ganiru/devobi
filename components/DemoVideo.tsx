import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * DemoVideo component
 * Displays the embedded Loom video in a clean, distraction-free premium layout.
 */
const DemoVideo: React.FC = () => {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen pt-32 pb-16 px-6 relative flex flex-col items-center justify-center overflow-hidden">
            {/* Background Decorative Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[10%] left-[-15%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[10%] right-[-15%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="w-full max-w-4xl mx-auto relative z-10 flex flex-col items-center">
                {/* Loom Video Embed Card */}
                <div className="w-full glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 hover:border-emerald-500/30" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                        src="https://www.loom.com/embed/5dc35d7b0eea47bab5269cc35c6539ea"
                        frameBorder="0"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        title="Devobi Demo Video"
                        className="w-full h-full"
                    ></iframe>
                </div>

                {/* Back to Home Button */}
                <div className="mt-8">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                            window.scrollTo(0, 0);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-xl text-emerald-400 font-semibold transition-all transform active:scale-95 cursor-pointer text-sm"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </main>
    );
};

export default DemoVideo;
