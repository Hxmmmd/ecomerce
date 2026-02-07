import { ProductCardSkeleton } from '@/components/Skeletons';

export default function AdminDashboardLoading() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="h-10 bg-white/10 rounded w-64 animate-pulse" />

                <div className="flex flex-1 max-w-2xl items-center justify-end gap-4">
                    <div className="h-10 bg-white/10 rounded flex-1 max-w-md animate-pulse" />
                    <div className="h-10 bg-white/10 rounded w-32 animate-pulse" />
                    <div className="h-10 bg-white/10 rounded w-28 animate-pulse" />
                </div>
            </div>

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
                </aside>

                {/* Products Grid Skeleton */}
                <div className="space-y-6">
                    <div className="h-6 bg-white/10 rounded w-48 animate-pulse" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
