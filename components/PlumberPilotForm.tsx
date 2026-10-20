import React, { useState } from 'react';

const SEND_MAIL_URL = '/api/send-mail';
const CALENDLY_LINK = 'https://calendly.com/obinnae/ai-consultation';

const PlumberPilotForm: React.FC<{ sourceUrl: string }> = ({ sourceUrl }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formData.get('_honey')) {
      console.warn('Spam detected');
      return;
    }

    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(SEND_MAIL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'obi@devobi.com',
          subject: 'New Plumber Voice Trial Request',
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Source: ${sourceUrl}`,
          ].join('\n'),
          html: `<div>
            <h2>New Plumber Voice Trial Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Source:</strong> ${sourceUrl}</p>
          </div>`,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        await fetch(SEND_MAIL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: 'Next step: schedule your plumber voice agent pilot',
            text: `Hi ${name},\n\nThank you for your interest in our free trial. 
The next step is a quick 30-minute setup call. We'll listen to how you currently handle calls and get the AI voice agent running.
Choose a time that works for you here: ${CALENDLY_LINK}
If none of the available slots work, just reply to this email and we'll find a time that does.
Looking forward to talking with you.
In the meantime, you can test it live (as a pretend customer) by calling this number +1 (469) 606-0963. Use a fake name, number and address when prompted.`,
            html: `<div>
              Hi ${name},
              <p>Thanks for submitting a Free Trial request for our AI Voice Agent. I'm excited to learn more about your business.</p>
              <p>The next step is a quick 30-minute setup call. We'll go over how you currently handle calls and get the AI voice agent running.</p>
              <p>Choose a time that works for you here: <a href='${CALENDLY_LINK}' target="_blank" rel="noopener noreferrer">${CALENDLY_LINK}</a></p>
              <p>If none of the available slots work, just reply to this email and we'll find a time that does.</p>
              <p>Looking forward to talking with you.</p>
              <p>In the meantime, you can test it live (as a pretend customer) by calling this number +1 (469) 606-0963. Use a fake name, number and address when prompted.</p>
            </div>`,
          }),
        }).catch((error) => {
          console.error('Error sending calendar invite:', error);
        });
        form.reset();
      } else {
        setError('Something went wrong. Please try again or email us directly.');
      }
    } catch {
      setError('Connection failed. Please check your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#221E17] border border-[#373226] rounded-[5px] p-8 md:p-9 text-left">
      {submitted ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-bold text-accent mb-4">We've received your submission!</h3>
          <h5 className="text-[#B7B1A4]">You should be receiving a meeting invite shortly. Please check your spam and trash folders as well.</h5>
        </div>
      ) : (
        <>
          <h3 className="text-[1.4rem] font-extrabold tracking-[-0.02em] mb-2 text-white">Request Your Free 14-Day Pilot</h3>
          <p className="text-[0.88rem] text-[#B7B1A4] mb-6">Spots are limited so we can protect your market from competitors.</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="_honey" style={{ display: 'none' }} />
            <div className="space-y-2">
              <label htmlFor="plumber-pilot-name" className="text-xs uppercase font-bold text-[#B7B1A4] tracking-wider">Full Name</label>
              <input
                type="text"
                id="plumber-pilot-name"
                name="name"
                required
                placeholder="John Doe"
                className="w-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-[#373226] text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all rounded-[5px]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="plumber-pilot-email" className="text-xs uppercase font-bold text-[#B7B1A4] tracking-wider">Email Address</label>
              <input
                type="email"
                id="plumber-pilot-email"
                name="email"
                required
                placeholder="john@abcplumbing.com"
                className="w-full px-5 py-[13px] text-[0.95rem] bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-[#373226] text-ink placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-accent transition-all rounded-[5px]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 cursor-pointer font-semibold text-[0.95rem] no-underline rounded-[5px] px-[26px] py-[13px] bg-accent text-white hover:bg-accent-dark disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors w-full"
            >
              {isLoading ? 'Submitting...' : 'Request Free 14-Day Pilot'}
            </button>
            {error && (
              <p className="md:col-span-2 text-center text-sm text-red-400 mt-2">
                {error}
              </p>
            )}
            <p className="md:col-span-2 text-center text-xs text-[#B7B1A4]/60">
              We respect your privacy. Your information is never shared or sold.
            </p>
          </form>
        </>
      )}
    </div>
  );
};

export default PlumberPilotForm;
