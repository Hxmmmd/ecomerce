import { OrderCardSkeleton } from '@/components/Skeletons';

export default function UserOrdersLoading() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Header placeholder */}
            <div className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-md" />

            <div className="container px-4 md:px-6 py-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Page Header Skeleton */}
                    <div className="space-y-2">
                        <div className="h-10 bg-white/10 rounded w-48 animate-pulse" />
                        <div className="h-4 bg-white/10 rounded w-64 animate-pulse" />
                    </div>

                    {/* Orders List Skeleton */}
                    <div className="space-y-6">
                        {[...Array(4)].map((_, i) => (
                            <OrderCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
