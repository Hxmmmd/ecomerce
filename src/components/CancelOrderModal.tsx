'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { X, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string) => Promise<void>;
    orderId: string;
}

export default function CancelOrderModal({ isOpen, onClose, onConfirm, orderId }: CancelOrderModalProps) {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
            setError('Please enter your password to confirm');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onConfirm(password);
            setPassword('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative background element */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 blur-[100px] rounded-full" />

                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors disabled:opacity-30"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <header className="text-center mb-8 relative">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                                <ShieldCheck className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tighter mb-2 text-white">Security Check</h2>
                            <p className="text-gray-400 text-sm">
                                To cancel order <span className="text-white font-mono">#{orderId.slice(-8).toUpperCase()}</span>, please verify your identity.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-6 relative">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                                    Enter Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    autoFocus
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p className="text-xs font-bold leading-tight">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
                                >
                                    Go Back
                                </button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[1.5] py-4 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Confirm Cancel'
                                    )}
                                </Button>
                            </div>
                        </form>

                        <p className="text-[9px] text-gray-600 text-center mt-8 uppercase font-bold tracking-[0.2em] leading-relaxed">
                            This action will immediately restore stock <br /> and cannot be undone.
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
