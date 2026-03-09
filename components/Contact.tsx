
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    if (formData.get("_honey")) {
      console.warn("Spam detected");
      return;
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/obi@devobi.com", {
        method: "POST",
        body: formData
      });
      console.log(response, response.ok);
      if (response.ok) {
        setSubmitted(true);
        form.reset();
        setTimeout(() => setSubmitted(false), 5000);
      }
      else {
        console.error("Failed to send email", response);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto glass p-8 md:p-16 rounded-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Let's Eliminate Your Biggest Time-Waster</h2>
          <p className="text-gray-400">Tell us what's slowing you down. We'll show you exactly how to automate it — free, no obligation.</p>
        </div>

        {submitted ? (
          <div className="text-center py-12 animate-bounce">
            <h3 className="text-2xl font-bold text-emerald-500">Message Sent!</h3>
            <p className="text-gray-400 mt-2">We'll be in touch within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="_honey" style={{ display: 'none' }} />
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@realty.com"
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Primary CRM</label>
              <input
                type="text"
                name="crm"
                placeholder="Follow Up Boss, LionDesk, etc."
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">What's your biggest bottleneck?</label>
              <textarea
                rows={4}
                name="message"
                placeholder="I spend 4 hours a day on lead follow-up..."
                className="w-full bg-black border border-white/10 p-4 rounded-sm focus:border-emerald-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="md:col-span-2 bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-sm font-bold text-lg transition-all"
            >
              Get My Free Strategy Session →
            </button>
            <p className="md:col-span-2 text-center text-xs text-gray-600">
              We respect your privacy. Your information is never shared or sold.
            </p>
          </form>
        )}

        <div className="mt-12 pt-12 border-t border-white/5 text-center flex flex-col md:flex-row justify-center gap-8 text-gray-500 text-sm">
          <span>Email: info@devobi.com</span>
          <span>Consultancy: Devobi LLC</span>
        </div>
      </div>
    </section>
  );
};

export default Contact;
