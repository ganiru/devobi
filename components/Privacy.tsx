import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-gray-300">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Privacy Policy</h1>

            <div className="space-y-8 text-lg leading-relaxed">
                <section>
                    <p>
                        At Devobi LLC, we care deeply about your privacy. This Privacy Policy explains how we handle your information when you visit our website or interact with us. We do not store your personal information, and we will never sell, rent, or share it with third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Information We Collect</h2>
                    <p className="mb-4">
                        We do not require registration or account creation to use our website. The only personal information we receive is what you voluntarily provide through our contact and inquiry forms, which may include:
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>Your name</li>
                        <li>Your email address</li>
                        <li>Your phone number</li>
                        <li>Any details you include in a message or form submission</li>
                    </ul>
                    <p className="mt-4">
                        We do not store this information in any database or system beyond what is necessary to respond to your inquiry. We do not use cookies or tracking technologies to collect personal data.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">How We Use Your Information</h2>
                    <p className="mb-4">
                        Any information you provide is used solely for the specific purpose for which it was submitted. This includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>Responding to your inquiries or form submissions</li>
                        <li>Scheduling and confirming consultation appointments</li>
                        <li>Communicating with you about the services you requested</li>
                        <li>Sending text messages if you have opted in to our SMS program</li>
                    </ul>
                    <p className="mt-4">
                        We do not use your information for any purpose beyond what you intended when you provided it. We do not create accounts, profiles, or records of your data.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Sharing of Your Information</h2>
                    <p>
                        We do not sell, rent, trade, or share your personal information with any third parties — for marketing or any other purpose. Your information is used exclusively by Devobi LLC to fulfill the purpose for which you provided it.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Third-Party Services</h2>
                    <p>
                        Our website may use third-party analytics tools (such as Google Analytics) that collect anonymous, non-personal usage data to help us understand how visitors use our site. These tools do not collect your name, email, phone number, or any personally identifiable information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at:
                    </p>
                    <p className="mt-4 font-semibold">
                        <a href="mailto:info@devobi.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                            info@devobi.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
