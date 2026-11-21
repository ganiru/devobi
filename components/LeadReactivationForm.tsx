import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import AuthGate from './AuthGate';
import TurnstileWidget from './TurnstileWidget';

/** Keep in sync with MAX_CSV_BYTES in lib/csv.ts (the server is authoritative). */
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

/** Server error codes -> copy. Anything unknown falls back to a generic message. */
const ERROR_MESSAGES: Record<string, string> = {
  file_too_large: 'That CSV is larger than 2 MB. Please split it into smaller files.',
  unsupported_file_type: 'Please upload a .csv file.',
  binary_content: 'That file is not a text CSV.',
  invalid_encoding: 'That CSV is not valid UTF-8. Please re-export it as UTF-8 and try again.',
  no_header: 'The CSV is missing a header row.',
  no_data_rows: 'The CSV does not contain any lead rows.',
  too_many_rows: 'That CSV has more than 5,000 rows. Please split it into smaller files.',
  too_many_columns: 'That CSV has too many columns.',
  empty_file: 'That CSV file is empty.',
  missing_csv: 'Please select a CSV file.',
  invalid_agent_details: 'Check the agent name, phone number and email address.',
  captcha_failed: 'Verification failed. Please complete the challenge and try again.',
  verification_unavailable: 'Verification is temporarily unavailable. Please try again shortly.',
  rate_limited: 'Too many uploads from this network. Please wait a minute and try again.',
  intake_not_configured: 'Uploads are not configured on the server yet. Please contact us.',
  rejected_upstream: 'The upload was rejected. Please check the CSV and try again.',
};

/**
 * Lead Reactivation upload.
 *
 * This form posts to our own `/api/reactivate` endpoint, which holds the n8n
 * webhook URL and secret, verifies the Turnstile token, and validates the CSV
 * before anything reaches n8n. The browser never sees the webhook or its secret.
 */
const LeadReactivationFormInner: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedRows, setUploadedRows] = useState<number | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  // Changing this remounts the widget, which is how a Turnstile token is spent.
  const [widgetKey, setWidgetKey] = useState(0);
  const [agentName, setAgentName] = useState('John Doe');
  const [agentPhone, setAgentPhone] = useState('(555) 123-4567');
  const [agentEmail, setAgentEmail] = useState('john@example.com');
  const [emailSignature, setEmailSignature] = useState('John Doe, Home Service Contractor');

  useEffect(() => {
    document.title = 'Reactivate Leads | Devobi LLC AI Automation';
  }, []);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const TURNSTILE_SITE_KEY = process.env.TURNSTILE_SITE_KEY || '';

  // Disabled unless a CSV file is chosen and the email is valid
  const isFormValid = Boolean(csvFile && isValidEmail(agentEmail) && turnstileToken);

  const resetTurnstile = () => {
    setTurnstileToken(null);
    setWidgetKey(key => key + 1);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setErrorMessage('');
    } else {
      setCsvFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!csvFile) {
      setErrorMessage('Please select a CSV file.');
      return;
    }
    if (!isValidEmail(agentEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (csvFile.size > MAX_UPLOAD_BYTES) {
      setErrorMessage(ERROR_MESSAGES.file_too_large);
      return;
    }
    if (!turnstileToken) {
      setErrorMessage('Please complete the verification challenge.');
      return;
    }

    setStatus('loading');
    try {
      const formData = new FormData();
      formData.append('csv_file', csvFile);
      formData.append('agent_name', agentName);
      formData.append('agent_phone', agentPhone);
      formData.append('agent_email', agentEmail.trim());
      formData.append('email_signature', emailSignature);
      formData.append('campaign_name', 'Reactivation Campaign');
      formData.append('cf-turnstile-response', turnstileToken);

      const response = await fetch('/api/reactivate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json().catch(() => ({} as { success?: boolean; error?: string; rows?: number }));

      if (response.ok && result.success) {
        setUploadedRows(typeof result.rows === 'number' ? result.rows : null);
        setStatus('success');
        // Reset fields
        setCsvFile(null);
        setAgentName('John Doe');
        setAgentPhone('(555) 123-4567');
        setAgentEmail('john@example.com');
        setEmailSignature('John Doe, Home Service Contractor');
        // Reset file input value
        const fileInput = document.getElementById('csv') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
      } else {
        setStatus('error');
        setErrorMessage(
          ERROR_MESSAGES[result.error || ''] ||
            'Submission failed. Please check the file and try again.',
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('Could not reach the server. Please check your connection and try again.');
    } finally {
      // A Turnstile token is single-use, whether or not the request succeeded.
      resetTurnstile();
    }
  };

  return (
    <AuthGate>
      {status === 'success' ? (
        <main className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center">
          <div className="glass p-12 rounded-3xl max-w-xl w-full mx-auto text-center border-emerald-500/30 shadow-2xl animate-in fade-in zoom-in duration-500">
            <h3 className="text-3xl font-bold mb-4 text-white">Leads Uploaded!</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-sm mx-auto">
              {uploadedRows !== null
                ? `${uploadedRows.toLocaleString()} lead${uploadedRows === 1 ? '' : 's'} received. The reactivation will begin shortly.`
                : 'Your CSV has been submitted. The lead reactivation will begin shortly.'}
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setUploadedRows(null);
              }}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-emerald-400 font-semibold transition-all cursor-pointer"
            >
              Upload Another CSV
            </button>
          </div>
        </main>
      ) : (
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
                <p className="text-[11px] text-gray-500 ml-1">UTF-8 .csv, up to 2 MB and 5,000 rows.</p>
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
                    className={`w-full bg-black border p-4 outline-none transition-all ${
                      agentEmail && !isValidEmail(agentEmail)
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-white/10 focus:border-emerald-500'
                    }`}
                  />
                  {agentEmail && !isValidEmail(agentEmail) && (
                    <p className="text-red-400 text-xs ml-1">Please enter a valid email address.</p>
                  )}
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
                    placeholder="Best, John\nHome Service Contractor"
                    className="w-full bg-black border border-white/10 p-4 focus:border-emerald-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <TurnstileWidget
                key={widgetKey}
                siteKey={TURNSTILE_SITE_KEY}
                onToken={setTurnstileToken}
                className="flex justify-center"
              />

              {status === 'error' && errorMessage && (
                <div className="py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm text-center font-medium">{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || status === 'loading'}
                className={`w-full py-5 font-black text-black text-lg transition-all transform relative overflow-hidden group ${
                  !isFormValid || status === 'loading'
                    ? 'bg-emerald-600/40 text-black/50 cursor-not-allowed'
                    : 'bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] shadow-[0_10px_30px_rgba(52,211,153,0.2)]'
                }`}
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

              <p className="text-[11px] text-gray-500 text-center leading-normal">
                This site is protected by Cloudflare Turnstile. The{' '}
                <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer" className="text-gray-400 underline hover:text-gray-300">
                  Cloudflare Privacy Policy
                </a>{' '}
                and{' '}
                <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noreferrer" className="text-gray-400 underline hover:text-gray-300">
                  Website Terms
                </a>{' '}
                apply.
              </p>
            </form>
          </div>
        </main>
      )}
    </AuthGate>
  );
};

const LeadReactivationForm: React.FC = () => <LeadReactivationFormInner />;

export default LeadReactivationForm;
