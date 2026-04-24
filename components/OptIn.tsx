import React from 'react';
import { Link } from 'react-router-dom';

const OptIn: React.FC = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-gray-300">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">SMS Text Message Consent</h1>
            <p className="text-emerald-400 text-lg mb-10 font-medium">Proof of Opt-In for Text Messaging</p>

            <div className="space-y-10 text-lg leading-relaxed">

                {/* Program Overview */}
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Program Description</h2>
                    <p>
                        Devobi LLC ("Devobi," "we," "us," or "our") offers an SMS text messaging program to provide
                        clients and prospective clients with important updates, appointment reminders, service notifications,
                        and promotional information related to our AI automation consulting services for real estate professionals.
                    </p>
                </section>

                {/* How Consent Is Collected */}
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">How You Opt In</h2>
                    <p className="mb-4">
                        By providing your phone number and expressly consenting to receive text messages from Devobi LLC,
                        you are opting in to our SMS messaging program. Consent may be collected in the following ways:
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            <strong className="text-white">Website Forms:</strong> By submitting a contact, lead, or
                            consultation form on our website (devobi.com) that includes a phone number field and a consent
                            checkbox or disclosure statement.
                        </li>
                        <li>
                            <strong className="text-white">Text-to-Join:</strong> By texting a keyword (e.g., "JOIN" or "START")
                            to our designated phone number.
                        </li>
                        <li>
                            <strong className="text-white">Verbal or Written Consent:</strong> By providing explicit verbal
                            or written consent during a consultation, meeting, or other interaction with Devobi LLC.
                        </li>
                    </ul>
                </section>

                {/* Consent Language */}
                <section>
                    <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Consent Language</h2>
                        <p className="italic text-gray-200">
                            "By providing your phone number and checking this box, you agree to receive recurring
                            automated text messages from Devobi LLC at the phone number provided. Your phone number
                            will only be used for this purpose and will never be sold or shared. Consent is not a
                            condition of purchase. Message and data rates may apply. Message frequency varies. Reply
                            HELP for help or STOP to cancel at any time. View our{' '}
                            <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 underline transition-colors">
                                Privacy Policy
                            </Link>{' '}
                            and{' '}
                            <a href="#message-terms" className="text-emerald-400 hover:text-emerald-300 underline transition-colors">
                                SMS Terms
                            </a>."
                        </p>
                    </div>
                </section>

                {/* Message Types & Frequency */}
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Types of Messages</h2>
                    <p className="mb-4">
                        Once opted in, you may receive text messages including but not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>Appointment confirmations and reminders</li>
                        <li>Service updates and status notifications</li>
                        <li>Follow-up communications regarding consultations or inquiries</li>
                        <li>Promotional offers and announcements about our services</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Message Frequency</h2>
                    <p>
                        Message frequency varies based on your interactions with Devobi LLC. You may receive
                        recurring messages. On average, subscribers may receive up to <strong className="text-white">10 messages per month</strong>,
                        but this may vary depending on your activity and communication preferences.
                    </p>
                </section>

                {/* Costs */}
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Message & Data Rates</h2>
                    <p>
                        Standard message and data rates may apply depending on your mobile carrier and plan.
                        Devobi LLC is not responsible for any fees charged by your wireless provider.
                    </p>
                </section>

                {/* Opt-Out */}
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">How to Opt Out</h2>
                    <p className="mb-4">
                        You can opt out of receiving text messages at any time by using any of the following methods:
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            <strong className="text-white">Reply STOP:</strong> Text <span className="text-emerald-400 font-mono font-bold">STOP</span> to
                            any message you receive from us. You will receive a one-time confirmation message and will
                            no longer receive text messages from this program.
                        </li>
                        <li>
                            <strong className="text-white">Email Us:</strong> Contact us at{' '}
                            <a href="mailto:info@devobi.com" className="text-emerald-400 hover:text-emerald-300 transition-colors underline">
                                info@devobi.com
                            </a>{' '}
                            with your request to stop receiving SMS messages.
                        </li>
                    </ul>
                    <p className="mt-4">
                        After opting out, you will no longer receive text messages from Devobi LLC unless you
                        re-subscribe. You may opt back in at any time by texting <span className="text-emerald-400 font-mono font-bold">START</span> to
                        our number or by submitting a new consent through our website.
                    </p>
                </section>

                {/* Help */}
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Need Help?</h2>
                    <p>
                        For support regarding our SMS messaging program, text <span className="text-emerald-400 font-mono font-bold">HELP</span> to
                        any message from us, or contact us directly:
                    </p>
                    <div className="mt-4 pl-6 border-l-2 border-emerald-500/40 space-y-2">
                        <p><strong className="text-white">Devobi LLC</strong></p>
                        <p>
                            Email:{' '}
                            <a href="mailto:info@devobi.com" className="text-emerald-400 hover:text-emerald-300 transition-colors underline">
                                info@devobi.com
                            </a>
                        </p>
                        <p>
                            Website:{' '}
                            <a href="https://devobi.com" className="text-emerald-400 hover:text-emerald-300 transition-colors underline">
                                devobi.com
                            </a>
                        </p>
                    </div>
                </section>

                {/* SMS Terms */}
                <section id="message-terms">
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">SMS Terms & Conditions</h2>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            Consent to receive text messages is not required as a condition of purchasing any goods
                            or services from Devobi LLC.
                        </li>
                        <li>
                            We do not store your phone number or personal information in any database. Your information
                            is used solely to deliver the messages you have consented to receive.
                        </li>
                        <li>
                            We will never sell, rent, or share your phone number or opt-in data with any third
                            parties for any purpose.
                        </li>
                        <li>
                            We reserve the right to modify this SMS program and these terms at any time. Changes
                            will be posted on this page with an updated effective date.
                        </li>
                        <li>
                            Carriers are not liable for delayed or undelivered messages.
                        </li>
                        <li>
                            By participating in this program, you agree to all of the above terms and conditions.
                        </li>
                    </ul>
                </section>

                {/* Privacy */}
                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Privacy</h2>
                    <p>
                        Your privacy is important to us. We do not store your personal information, and we will never
                        sell, rent, or share your phone number or any other data with third parties for any purpose.
                        Your information is used exclusively to communicate with you as you have requested. Please
                        review our{' '}
                        <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 underline transition-colors">
                            Privacy Policy
                        </Link>{' '}
                        for more details.
                    </p>
                </section>

                {/* Effective Date */}
                <section className="border-t border-white/10 pt-8 mt-8">
                    <p className="text-gray-500 text-base">
                        <strong className="text-gray-400">Effective Date:</strong> April 24, 2026
                    </p>
                    <p className="text-gray-500 text-base mt-1">
                        <strong className="text-gray-400">Last Updated:</strong> April 24, 2026
                    </p>
                </section>

            </div>
        </div>
    );
};

export default OptIn;
