import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />
            <div className="pt-24 pb-12">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Information Collection</h2>
                            <p>
                                We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, phone number, shipping address, and payment information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Use of Information</h2>
                            <p>
                                We use the information we collect to process your orders, communicate with you about your account, and send you promotional emails (if you opt in). We do not sell your personal data to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Cookies</h2>
                            <p>
                                We use cookies to improve your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at privacy@Levric.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
