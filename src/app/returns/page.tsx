import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />
            <div className="pt-24 pb-12">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Returns & Exchanges</h1>
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">7-Day Money Back Guarantee</h2>
                            <p>
                                We want you to be completely satisfied with your purchase. If you change your mind, you can return your item within 7 days of delivery for a full refund, provided it is unopened and in its original packaging.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Defective Items</h2>
                            <p>
                                We test every machine before dispatch. However, if you receive a defective unit, we offer a 15-day replacement warranty. Please report any issues within 24 hours of receiving the product.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">How to Request a Return</h2>
                            <p>
                                To initiate a return, please email us at support@levric.store or call our customer service. We will arrange a reverse pickup from your address.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Refund Process</h2>
                            <p>
                                Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed within 5-7 business days via bank transfer.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
