import { ProductCardSkeleton } from '@/components/Skeletons';

export default function HomeLoading() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Header placeholder */}
            <div className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-md" />

            {/* Hero skeleton */}
            <div className="container px-4 md:px-6 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-6 animate-pulse">
                    <div className="h-16 bg-white/10 rounded-xl w-3/4 mx-auto" />
                    <div className="h-6 bg-white/10 rounded-xl w-2/3 mx-auto" />
                    <div className="flex gap-4 justify-center">
                        <div className="h-12 bg-white/10 rounded-xl w-32" />
                        <div className="h-12 bg-white/10 rounded-xl w-32" />
                    </div>
                </div>
            </div>

            {/* New Arrivals Section */}
            <section className="container px-4 md:px-6 py-20 border-b border-white/5">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-2">
                        <div className="h-10 bg-white/10 rounded w-48 animate-pulse" />
                        <div className="h-4 bg-white/10 rounded w-64 animate-pulse" />
                    </div>
                    <div className="h-10 bg-white/10 rounded w-32 animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </section>

            {/* Used Deals Section */}
            <section className="container px-4 md:px-6 py-20">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-2">
                        <div className="h-10 bg-white/10 rounded w-56 animate-pulse" />
                        <div className="h-4 bg-white/10 rounded w-72 animate-pulse" />
                    </div>
                    <div className="h-10 bg-white/10 rounded w-32 animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </section>
        </main>
    );
}
