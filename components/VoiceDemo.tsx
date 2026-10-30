import React, { Suspense, useState } from 'react';
import { Wrench, Sparkles, Store, ToyBrick, Mic } from 'lucide-react';
import { useParams } from 'react-router-dom';
import InlineVoiceAgent from "./InlineVoiceAgent";
import {
  DEFAULT_VOICE_AGENT_KEY,
  VOICE_AGENTS,
  getVoiceAgentByKey,
  getVoiceAgentBySlug,
} from '../voiceAgents';

/**
 * /voicedemo — interactive Vapi voice-agent widget demo.
 *
 * Lets a visitor pick which assistant (Plumber / Medspa / African Market /
 * Kidz Playon) to talk to, then renders the Vapi chat widget for that assistant.
 *
 * Deep links preselected a single agent: /voicedemo/plumber and friends render
 * that agent with no picker. The agents themselves live in the shared registry
 * at voiceAgents.ts, which also feeds the prerendered route table.
 *
 * The public key comes from `VAPI_PUBLIC_KEY` in .env.local (exposed to the
 * client via vite.config.ts `define`).
 *
 * NOTE: VapiWidget is lazy-loaded because the SDK touches `document` at
 * module scope (to inject its stylesheet). Importing it eagerly would crash
 * the Node-based prerender step, which has no DOM. With React.lazy the SDK
 * chunk is only fetched and executed in the browser.
 */
const CALENDLY_LINK = 'https://calendly.com/obinnae/ai-consultation?utm_source=voice_page&utm_campaign=voice_agent';

const VapiWidget = React.lazy(() =>
  import('@vapi-ai/client-sdk-react').then((m) => ({ default: m.VapiWidget }))
);

// Industry-relevant avatar icons per assistant. Keyed by agent key; agents
// without an entry fall back to the generic mic icon below.
const ASSISTANT_ICONS: Record<string, React.ReactNode> = {
  plumber: <Wrench size={40} strokeWidth={1.8} />,
  medspa: <Sparkles size={40} strokeWidth={1.8} />,
  'african-market': <Store size={40} strokeWidth={1.8} />,
  'kidz-playon': <ToyBrick size={40} strokeWidth={1.8} />,
};

const DEFAULT_ICON = <Mic size={40} strokeWidth={1.8} />;

const VAPI_PUBLIC_KEY = process.env.VAPI_PUBLIC_KEY || '';

const VoiceDemo: React.FC = () => {
  // /voicedemo/:assistant — when the URL names a real agent the demo is locked
  // to it and the picker is hidden. Unknown slugs (and bare /voicedemo) behave
  // like the picker page.
  const { assistant: assistantSlug } = useParams<{ assistant: string }>();
  const lockedAgent = getVoiceAgentBySlug(assistantSlug);

  // Only the picker page needs selection state; a locked page derives the
  // agent from the URL, so switching deep links always shows the right one.
  const [pickedKey, setPickedKey] = useState<string>(DEFAULT_VOICE_AGENT_KEY);

  const selectedAgent =
    lockedAgent ?? getVoiceAgentByKey(pickedKey) ?? VOICE_AGENTS[0];
  const selectedAssistantId = selectedAgent.assistantId;
  const selectedAssistantLabel = selectedAgent.label;

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [otherBusinessType, setOtherBusinessType] = useState('');

  const handlePhoneFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot spam trap — matches project convention.
    if (formData.get('_honey')) return;

    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    // Resolve the business type: if "Other" is selected, use the custom text.
    const selectedType = String(formData.get('businessType') || '');
    const resolvedType =
      selectedType === 'other'
        ? String(formData.get('otherBusinessType') || '').trim() || 'Other'
        : selectedType;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'obi@devobi.com',
          subject: 'New Phone Voice Agent Interest — Voice Demo',
          text: `Name: ${name}\nEmail: ${email}\nBusiness Type: ${resolvedType}`,
          html: `<div>
            <h2>New Phone Voice Agent Interest</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Business Type:</strong> ${resolvedType}</p>
          </div>`,
        }),
      });

      if (!response.ok) throw new Error('Could not send request.');

      setSubmitted(true);
      form.reset();
      await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Your 14-Day Free Pilot Request for Voice Agent',
          text: `Hi ${name},\n\nThanks for your interest in the 14-day free pilot for Voice Agent. Choose a time for a quick kickoff call here: ${CALENDLY_LINK}\n\nWe look forward to learning more about your ${resolvedType} business.`,
          html: `<div><p>Hi ${name},</p><p>Thanks for your interest in the 14-day free pilot for Voice Agent. Choose a time for a quick kickoff call using the link below:</p><p><a href="${CALENDLY_LINK}">Schedule your kickoff call</a></p><p>We look forward to learning more about your ${resolvedType} business.</p></div>`,
        }),
      }).catch(() => undefined);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cream text-ink font-sans antialiased min-h-screen pt-[68px]">
      <div className="wrap max-w-[720px] mx-auto px-6 py-[88px]">
        <header className="text-center mb-10">
          <p className="text-[0.76rem] tracking-[0.14em] uppercase text-muted font-semibold mb-[14px]">
            Devobi · Voice AI Demo
          </p>
          <h1 className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.12] mb-[14px]">
            Talk to a Voice Agent
          </h1>
          <p className="text-muted max-w-[52ch] mx-auto leading-relaxed">
            {lockedAgent ? (
              <>
                Here's the web version of the {selectedAssistantLabel} voice agent. Press
                start and talk to it like a real customer would.
              </>
            ) : (
              <>
                Pick an assistant below and start talking. Each one is a real
                voice agent configured for its industry.
              </>
            )}
          </p>
        </header>

        {/* A deep link names its agent, so the picker is hidden and the page
            reads as that single assistant's demo. */}
        {!lockedAgent && (
          <div className="mb-8 flex flex-col items-center">
            <label
              htmlFor="assistant-select"
              className="block text-sm font-semibold text-muted mb-2"
            >
              Choose an assistant
            </label>
            <select
              id="assistant-select"
              value={selectedAgent.key}
              onChange={(e) => setPickedKey(e.target.value)}
              className="max-w-[320px] w-full bg-white dark:bg-gray-800 border border-line rounded-md px-4 py-3 text-[0.95rem] text-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {VOICE_AGENTS.map((agent) => (
                <option key={agent.key} value={agent.key}>
                  {agent.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-center">
          <Suspense
            fallback={
              <div className="bg-white dark:bg-gray-800 border border-line rounded-md p-8 text-center text-muted">
                Loading voice agent…
              </div>
            }
          >
            <InlineVoiceAgent
              assistantId={selectedAssistantId}
              eyebrow={selectedAssistantLabel || 'Voice assistant'}
              title={`${selectedAssistantLabel.charAt(0).toUpperCase()}${selectedAssistantLabel.slice(1)} voice agent`}
              icon={ASSISTANT_ICONS[selectedAgent.key] ?? DEFAULT_ICON}
            />
            {/*<VapiWidget
              publicKey={VAPI_PUBLIC_KEY}
              assistantId={selectedAssistantId}
              mode="voice"
              theme="light"
              title={`Talk to a ${selectedAssistantLabel.charAt(0).toUpperCase()}${selectedAssistantLabel.slice(1)} Voice Agent`}
              startButtonText="Let's Talk"
              endButtonText="End Call"
              size="full"
              chatEmptyMessage="Hi! How can I help you today?"
              voiceEmptyMessage="Click to start a voice conversation"
            />*/}
          </Suspense>
        </div>

        {/* Phone version interest section */}
        <section id="phone-version" className="mt-16 max-w-[520px] mx-auto">
          <div className="bg-white dark:bg-gray-800 border border-line rounded-2xl p-8 lg:p-10">
            {submitted ? (
              <div className="text-center py-10">
                <h3 className="text-2xl font-extrabold tracking-[-0.02em] text-ink mb-3">
                  Thanks! We'll be in touch.
                </h3>
                <p className="text-muted max-w-[46ch] mx-auto">
                  Your request has been received. We'll reach out shortly to
                  talk about setting up a phone voice agent for your business.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-[clamp(1.4rem,2.5vw,1.8rem)] font-extrabold tracking-[-0.03em] text-ink mb-3">
                    Want this on your phone line?
                  </h2>
                  <p className="text-muted max-w-[52ch] mx-auto leading-relaxed">
                    This is just the web demo. We can put a voice agent on your
                    actual phone number — it answers every call, qualifies the
                    lead, and books the job. 
                    <br/>Request a <b>free 14-day pilot</b> below and we'll reach out to set it up.
                  </p>
                  <p className="text-muted text-xs max-w-[52ch] mx-auto leading-relaxed mt-2">
                    No credit card required.
                  </p>
                </div>
                <form onSubmit={handlePhoneFormSubmit} className="w-full space-y-4">
                  <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        id="phone-form-name"
                        name="name"
                        required
                        placeholder="Your name"
                        className="w-full bg-cream dark:bg-gray-900 border border-line rounded-md px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <input
                        type="email"
                        id="phone-form-email"
                        name="email"
                        required
                        placeholder="Your email"
                        className="w-full bg-cream dark:bg-gray-900 border border-line rounded-md px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <select
                      id="phone-form-type"
                      name="businessType"
                      required
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full bg-cream dark:bg-gray-900 border border-line rounded-md px-4 py-3 text-[0.95rem] text-ink cursor-pointer outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      <option value="" disabled>Select your business type</option>
                      <option value="plumber">Plumber</option>
                      <option value="medspa">Medspa</option>
                      <option value="store">Store</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {businessType === 'other' && (
                    <div className="space-y-2">
                      <label htmlFor="phone-form-other-type" className="block text-sm font-semibold text-muted">Please specify your business type</label>
                      <input
                        type="text"
                        id="phone-form-other-type"
                        name="otherBusinessType"
                        required
                        value={otherBusinessType}
                        onChange={(e) => setOtherBusinessType(e.target.value)}
                        placeholder="e.g. Lawn care, HVAC, Roofing…"
                        className="w-full bg-cream dark:bg-gray-900 border border-line rounded-md px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer font-semibold text-[0.95rem] no-underline rounded-md px-[26px] py-[13px] bg-accent text-white hover:bg-accent-dark disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Submitting…' : 'Request a Free 14-day pilot'}
                  </button>
                  {error && (
                    <p className="text-center text-sm text-red-500 dark:text-red-400">{error}</p>
                  )}
                  <p className="text-center text-xs text-muted/70">
                    We respect your privacy. Your information is never shared or sold.
                  </p>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VoiceDemo;