import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShippingPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />
            <div className="pt-24 pb-12">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Delivery Timeline</h2>
                            <p>
                                All orders are processed within 1-2 business days. Standard shipping typically takes 3-5 business days within major cities in Pakistan.
                                For remote areas, please allow up to 7 business days.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Shipping Costs</h2>
                            <p>
                                We offer free shipping on all laptop orders. For accessories under PKR 5000, a standard shipping fee of PKR 200 applies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Order Tracking</h2>
                            <p>
                                Once your order is shipped, you will receive a confirmation email with a tracking number. You can use this number to track your shipment on our courier partners website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">Damaged Orders</h2>
                            <p>
                                If your order arrives damaged, please contact us immediately at support@levric.store with your order number and photos of the items condition.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
