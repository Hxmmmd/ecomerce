'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Search, User, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
    const [mode, setMode] = useState<'selection' | 'form'>('selection');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validatePassword = (pass: string) => {
        const hasUpper = /[A-Z]/.test(pass);
        const hasLower = /[a-z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        return pass.length >= 8 && hasUpper && hasLower && hasNumber && hasSpecial;
    };

    const handleSocialLogin = async (provider: string) => {
        setLoading(true);
        try {
            await signIn(provider, { callbackUrl: '/' });
        } catch (err) {
            setError(`Failed to sign in with ${provider}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validatePassword(password)) {
            setError('Password must be 8+ chars with uppercase, lowercase, number, and special char.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                router.push('/login?success=Account created');
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordScore = () => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        return score;
    };

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 p-8 border border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-md relative overflow-hidden group">
                    {/* Glowing background effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[100px] rounded-full group-hover:bg-purple-600/20 transition-all duration-700" />

                    <div className="relative text-center space-y-2">
                        <h2 className="text-4xl font-black tracking-tighter text-white">
                            {mode === 'selection' ? 'Join Us' : 'Create Account'}
                        </h2>
                        <p className="text-sm text-muted-foreground font-medium italic">Join the future of tech</p>
                    </div>

                    {error && (
                        <div className="relative bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="relative space-y-4">
                        {mode === 'selection' ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => handleSocialLogin('google')}
                                    className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-xl"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </button>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase font-black"><span className="bg-[#0b0b0d] px-3 text-gray-500 tracking-[0.3em]">Or</span></div>
                                </div>

                                <button
                                    onClick={() => setMode('form')}
                                    className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 py-5 rounded-2xl font-bold transition-all active:scale-[0.98]"
                                >
                                    <Mail className="w-5 h-5 text-blue-500" />
                                    Continue with Email
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                                {/* Honeypot to catch browser autofill */}
                                <input type="text" style={{ display: 'none' }} aria-hidden="true" />
                                <input type="password" style={{ display: 'none' }} aria-hidden="true" />
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-xs font-black uppercase text-gray-500 tracking-widest pl-1">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="off"
                                        data-lpignore="true"
                                        readOnly
                                        onFocus={(e) => e.target.removeAttribute('readOnly')}
                                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-black uppercase text-gray-500 tracking-widest pl-1">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="off"
                                        data-lpignore="true"
                                        readOnly
                                        onFocus={(e) => e.target.removeAttribute('readOnly')}
                                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label htmlFor="password" className="text-xs font-black uppercase text-gray-500 tracking-widest">Password</label>
                                        {password && (
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${getPasswordScore() >= 5 ? 'text-green-500' :
                                                getPasswordScore() >= 3 ? 'text-yellow-500' : 'text-red-500'
                                                }`}>
                                                {getPasswordScore() >= 5 ? 'Strong' :
                                                    getPasswordScore() >= 3 ? 'Medium' : 'Weak'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="new-password"
                                            data-lpignore="true"
                                            readOnly
                                            onFocus={(e) => e.target.removeAttribute('readOnly')}
                                            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 pr-14 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {password && (
                                        <div className="flex gap-1.5 pt-1 px-1">
                                            {[1, 2, 3, 4, 5].map((step) => (
                                                <div
                                                    key={step}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${getPasswordScore() >= step ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/10'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4 pt-2">
                                    <Button type="submit" disabled={loading} className="w-full py-7 rounded-2xl font-black text-lg bg-white text-black hover:bg-gray-200 shadow-2xl transition-all active:scale-[0.98]">
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setMode('selection')}
                                        className="text-xs text-blue-500 font-black uppercase tracking-[0.2em] hover:text-blue-400 transition-colors"
                                    >
                                        Other Methods
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="relative text-center text-sm pt-4 border-t border-white/5">
                        <span className="text-muted-foreground font-medium">Already have an account? </span>
                        <Link href="/login" className="text-white hover:text-blue-400 underline font-black transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
