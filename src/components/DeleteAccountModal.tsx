'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Lock, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { verifyDeletionPassword, deleteOwnAccount } from '@/lib/actions/user';
import { signOut } from 'next-auth/react';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
    const [step, setStep] = useState<'password' | 'confirm'>('password');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await verifyDeletionPassword(password);
            if (res.success) {
                setStep('confirm');
            } else {
                setError(res.error || 'Verification failed');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteOwnAccount();
            await signOut({ callbackUrl: '/' });
        } catch (err) {
            setError('Failed to delete account');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
                    className="relative w-full max-w-[400px] aspect-square bg-[#0c0c0e] border border-red-500/20 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Danger Glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/10 blur-[80px] rounded-full" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10 w-full text-center space-y-6">
                        {step === 'password' ? (
                            <>
                                <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-2">
                                    <ShieldAlert className="w-8 h-8 text-red-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white tracking-widest uppercase">Security Check</h3>
                                    <p className="text-gray-500 text-xs font-medium">Please enter your password to confirm it's really you.</p>
                                </div>

                                <form onSubmit={handleVerify} className="space-y-4">
                                    {error && (
                                        <div className="text-red-500 text-[10px] bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                            {error}
                                        </div>
                                    )}
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="Your Password"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium"
                                        />
                                    </div>
                                    <Button disabled={loading} className="w-full py-7 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] shadow-lg shadow-red-900/20">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Verify Account'}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black text-white tracking-tight">Are you sure?</h3>
                                    <p className="text-gray-400 text-xs px-4">This will permanently delete your account, orders, and profile. This cannot be undone.</p>
                                </div>

                                <div className="grid gap-3 pt-4 w-full">
                                    <Button
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="w-full py-7 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Yes, Delete Everything'}
                                    </Button>
                                    <button
                                        onClick={onClose}
                                        className="text-xs text-gray-500 font-bold hover:text-white transition-colors"
                                    >
                                        I changed my mind
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
