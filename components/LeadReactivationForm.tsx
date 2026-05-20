import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';

/**
 * LeadReactivationForm component
 * A premium form for uploading a CSV of leads and providing agent details.
 * Submits data to an n8n webhook via multipart/form-data.
 */
const LeadReactivationForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [emailSignature, setEmailSignature] = useState('');

  useEffect(() => {
    document.title = 'Reactivate Leads | Devobi LLC AI Automation';
  }, []);

  // TODO: Replace with your actual n8n webhook URL
  const WEBHOOK_URL = 'https://n8n-production-6955.up.railway.app/webhook/b6aeb04b-87ea-4711-a67e-e89e7ac5f293';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      alert('Please select a CSV file.');
      return;
    }
    setStatus('loading');
    try {
      const formData = new FormData();
      formData.append('csv_file', csvFile);
      formData.append('agent_name', agentName);
      formData.append('agent_phone', agentPhone);
      formData.append('agent_email', agentEmail);
      formData.append('email_signature', emailSignature);
      formData.append('campaign_name', 'Reactivation Campaign');

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        // Reset fields
        setCsvFile(null);
        setAgentName('');
        setAgentPhone('');
        setAgentEmail('');
        setEmailSignature('');
        // Reset file input value
        (document.getElementById('csv') as HTMLInputElement).value = '';
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <main className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center">
        <div className="glass p-12 rounded-3xl max-w-xl w-full mx-auto text-center border-emerald-500/30 shadow-2xl animate-in fade-in zoom-in duration-500">
          <h3 className="text-3xl font-bold mb-4 text-white">Leads Uploaded!</h3>
          <p className="text-gray-400 text-lg mb-8 max-w-sm mx-auto">
            Your CSV has been submitted. The lead reactivation will begin shortly.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-emerald-400 font-semibold transition-all cursor-pointer"
          >
            Upload Another CSV
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-xl w-full mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent text-center">
          Reactivate Leads
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Upload a CSV of leads and provide your contact details. We'll process the list and reach out to the leads on your behalf.
        </p>
        <form onSubmit={handleSubmit} className="glass p-8 md:p-10 shadow-2xl space-y-6">
          {/* CSV Upload */}
          <div className="space-y-2.5">
            <label htmlFor="csv" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              Leads CSV
            </label>
            <input
              id="csv"
              name="csv"
              type="file"
              accept=".csv,text/csv"
              required
              onChange={handleFileChange}
              className="w-full bg-black border border-white/10 p-4 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Agent Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label htmlFor="agentName" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Agent Name
              </label>
              <input
                id="agentName"
                name="agent_name"
                type="text"
                required
                value={agentName}
                onChange={e => setAgentName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-black border border-white/10 p-4 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <label htmlFor="agentPhone" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Agent Phone
              </label>
              <input
                id="agentPhone"
                name="agent_phone"
                type="tel"
                required
                value={agentPhone}
                onChange={e => setAgentPhone(e.target.value)}
                placeholder="(555) 123‑4567"
                className="w-full bg-black border border-white/10 p-4 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <label htmlFor="agentEmail" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Agent Email
              </label>
              <input
                id="agentEmail"
                name="agent_email"
                type="email"
                required
                value={agentEmail}
                onChange={e => setAgentEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-black border border-white/10 p-4 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <label htmlFor="emailSignature" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Email Signature
              </label>
              <textarea
                id="emailSignature"
                name="email_signature"
                rows={3}
                value={emailSignature}
                onChange={e => setEmailSignature(e.target.value)}
                placeholder="Best, John\nReal Estate Agent"
                className="w-full bg-black border border-white/10 p-4 focus:border-emerald-500 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {status === 'error' && (
            <div className="py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm text-center font-medium">Submission failed. Please try again.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full py-5 font-black text-black text-lg transition-all transform active:scale-[0.98] relative overflow-hidden group ${status === 'loading' ? 'bg-emerald-600 cursor-not-allowed' : 'bg-emerald-400 hover:bg-emerald-300 shadow-[0_10px_30px_rgba(52,211,153,0.2)]'}`}
          >
            <span className={`flex items-center justify-center ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}>
              Upload Leads
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            {status === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LeadReactivationForm;
