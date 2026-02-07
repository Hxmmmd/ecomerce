'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    loading?: boolean;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'danger';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    loading = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary'
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const variantClasses = variant === 'danger'
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-white text-black hover:bg-gray-200';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-[400px] bg-[#0c0c0e] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden"
                >
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10 w-full space-y-6">
                        <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-2">
                            <AlertCircle className={`w-8 h-8 ${variant === 'danger' ? 'text-red-500' : 'text-blue-500'}`} />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
                            <p className="text-gray-500 text-sm font-medium">{message}</p>
                        </div>

                        <div className="grid gap-3 w-full">
                            <Button
                                onClick={onConfirm}
                                disabled={loading}
                                className={`w-full py-7 rounded-2xl font-black uppercase tracking-widest ${variantClasses}`}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : confirmText}
                            </Button>
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="text-xs text-gray-500 font-bold hover:text-white transition-colors py-2"
                            >
                                {cancelText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
