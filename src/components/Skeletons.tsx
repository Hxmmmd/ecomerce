export function ProductCardSkeleton() {
    return (
        <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 animate-pulse">
            <div className="aspect-[4/3] bg-white/10" />
            <div className="p-6 space-y-4">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-6 bg-white/10 rounded w-1/2" />
                <div className="flex items-center justify-between">
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                    <div className="h-8 bg-white/10 rounded w-20" />
                </div>
            </div>
        </div>
    );
}

export function OrderCardSkeleton() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md animate-pulse">
            <div className="p-6 md:p-8 grid md:grid-cols-12 gap-8 items-center">
                {/* Order Info */}
                <div className="md:col-span-3 space-y-4">
                    <div className="space-y-2">
                        <div className="h-3 bg-white/10 rounded w-20" />
                        <div className="h-4 bg-white/10 rounded w-32" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-5 bg-white/10 rounded w-28" />
                        <div className="h-3 bg-white/10 rounded w-40" />
                    </div>
                </div>

                {/* Items Preview */}
                <div className="md:col-span-2">
                    <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10" />
                        <div className="w-10 h-10 rounded-xl bg-white/10" />
                        <div className="w-10 h-10 rounded-xl bg-white/10" />
                    </div>
                    <div className="h-3 bg-white/10 rounded w-32 mt-2" />
                </div>

                {/* Actions & Status */}
                <div className="md:col-span-4 space-y-3">
                    <div className="h-8 bg-white/10 rounded-full w-24" />
                    <div className="flex gap-2">
                        <div className="h-9 bg-white/10 rounded-xl flex-1" />
                        <div className="h-9 bg-white/10 rounded-xl flex-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DashboardStatSkeleton() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-white/10 rounded w-24" />
                <div className="w-10 h-10 bg-white/10 rounded-xl" />
            </div>
            <div className="h-8 bg-white/10 rounded w-20 mb-2" />
            <div className="h-3 bg-white/10 rounded w-32" />
        </div>
    );
}
