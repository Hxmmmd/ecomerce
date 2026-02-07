import { OrderCardSkeleton } from '@/components/Skeletons';

export default function AdminOrdersLoading() {
    return (
        <div className="space-y-8 p-6 lg:p-12 min-h-screen bg-[#050505]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
                <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-32 animate-pulse" />
                    <div className="h-10 bg-white/10 rounded w-64 animate-pulse" />
                    <div className="h-4 bg-white/10 rounded w-80 animate-pulse" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="grid gap-6">
                    {[...Array(5)].map((_, i) => (
                        <OrderCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
