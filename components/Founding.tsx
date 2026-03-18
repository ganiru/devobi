import React from 'react';
import { Link } from 'react-router-dom';

const Founding: React.FC = () => {
    return (
        <main className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center flex-col">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">Founding Member: AI Lead Automation</h1>
                <p className="text-xl mb-4">$497/mo • Waived setup • Solo agents</p>

                <ul className="mb-4 text-gray-400 text-lg">
                    <li>✓ AI-powered lead scoring</li>
                    <li>✓ Automated SMS/email follow-up</li>
                    <li>✓ CRM sync (Follow Up Boss, LionDesk, etc.)</li>
                    <li>✓ Error alerts + weekly performance summary</li>
                </ul>

                <button type="button" 
                    className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 m-8 rounded-sm font-bold text-lg transition-all shadow-lg shadow-emerald-500/20"
                    onClick={() => window.location.href = "/workflow-audit"}
                >Start with Free Audit →</button>
                <p className="text-sm text-gray-500">Only 5 spots at founding pricing</p>
            </div>
        </main>
    )
}

export default Founding;