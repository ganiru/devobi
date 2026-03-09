import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-gray-300">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Privacy Policy</h1>

            <div className="space-y-8 text-lg leading-relaxed">
                <section>
                    <p>
                        At Devobi LLC, we care deeply about your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. By using our website, you consent to the data practices described in this statement.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Information We Collect</h2>
                    <p className="mb-4">
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                        <li><strong className="text-white">Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                        <li><strong className="text-white">Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Use of Your Information</h2>
                    <p className="mb-4">
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>Create and manage your account or consultation appointments.</li>
                        <li>Communicate with you regarding our services and offerings.</li>
                        <li>Fulfill and manage interactions related to our automated real estate solutions.</li>
                        <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
                        <li>Increase the efficiency and functionality of our Site and tools.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Disclosure of Your Information</h2>
                    <p className="mb-4">
                        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                        <li><strong className="text-white">By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                        <li><strong className="text-white">Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                    </ul>
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
