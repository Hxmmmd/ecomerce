import { ProductCardSkeleton } from '@/components/Skeletons';

export default function ProductsLoading() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Header placeholder */}
            <div className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-md" />

            <div className="container px-4 md:px-6 py-12">
                <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-8">
                    {/* Sidebar Filters Skeleton */}
                    <aside className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 animate-pulse">
                            <div className="h-6 bg-white/10 rounded w-32" />
                            <div className="space-y-3">
                                <div className="h-10 bg-white/10 rounded" />
                                <div className="h-10 bg-white/10 rounded" />
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 animate-pulse">
                            <div className="h-6 bg-white/10 rounded w-24" />
                            <div className="space-y-3">
                                <div className="h-8 bg-white/10 rounded" />
                                <div className="h-8 bg-white/10 rounded" />
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid Skeleton */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="h-8 bg-white/10 rounded w-48 animate-pulse" />
                            <div className="h-10 bg-white/10 rounded w-32 animate-pulse" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(9)].map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
