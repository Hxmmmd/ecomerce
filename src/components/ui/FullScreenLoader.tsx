'use client';

import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FullScreenLoader({ isLoading }: { isLoading: boolean }) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 animate-pulse" />
                            <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium animate-pulse">Processing...</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
