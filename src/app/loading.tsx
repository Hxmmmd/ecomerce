import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 animate-pulse" />
                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
                </div>
                <p className="text-gray-400 text-sm font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
}
