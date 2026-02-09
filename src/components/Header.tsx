'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X, User, LogOut, Package, ArrowLeft } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

import Search from '@/components/Search';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/lib/context/CartContext';

import { useAuthModal } from '@/lib/context/AuthModalContext';

export default function Header() {
    const { items } = useCart();
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { openAuthModal } = useAuthModal();

    // Memoize links to prevent recreation on every render
    const { links, isAdmin } = useMemo(() => {
        const userLinks = [
            { href: '/', label: 'Home' },
            { href: '/products', label: 'Laptops' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
        ];

        const adminLinks = [
            { href: '/admin', label: 'Dashboard' },
            { href: '/admin/orders', label: 'Sales' },
        ];

        const isAdmin = session?.user?.isAdmin;
        const links = isAdmin ? adminLinks : userLinks;

        return { links, isAdmin };
    }, [session?.user?.isAdmin]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-md supports-[backdrop-filter]:bg-black/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-start gap-8">
                    {/* Back Button - Mobile Only */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="md:hidden text-gray-400 hover:text-white hover:bg-white/10 -ml-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Go Back</span>
                    </Button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group flex-shrink-0 mr-4">
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-gray-200 transition-colors">
                            LEVRIC
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8 flex-shrink-0">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-white relative group",
                                    pathname === link.href ? "text-white" : "text-gray-400"
                                )}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <motion.span
                                        layoutId="underline"
                                        className="absolute left-0 right-0 block h-0.5 bg-white -bottom-4" // Underline effect
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar (Desktop) - Hidden for Admin */}
                    {!isAdmin && (
                        <div className="hidden md:block flex-1 max-w-md mx-4">
                            <Search className="max-w-md mx-auto" />
                        </div>
                    )}

                    {/* Icons */}
                    <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0 ml-auto">
                        {status === 'authenticated' && !isAdmin && (
                            <>
                                <Link href="/orders" className={cn(buttonVariants('ghost', 'icon'), "relative text-gray-400 hover:text-white hover:bg-white/10 group")}>
                                    <Package className="h-5 w-5 transition-transform group-hover:scale-110" />
                                    <span className="sr-only">Orders</span>
                                </Link>
                                <Link href="/cart" className={cn(buttonVariants('ghost', 'icon'), "relative text-gray-400 hover:text-white hover:bg-white/10 group")}>
                                    <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                                    {items.length > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 border border-black text-[9px] font-black text-white shadow-[0_0_10px_rgba(37,99,235,0.6)] animate-in zoom-in">
                                            {items.length}
                                        </span>
                                    )}
                                    <span className="sr-only">Cart</span>
                                </Link>
                            </>
                        )}

                        {status === 'authenticated' ? (
                            <>
                                <Link href="/profile" className={cn(buttonVariants('ghost', 'icon'), "text-gray-400 hover:text-white hover:bg-white/10")}>
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">Profile</span>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="sr-only">Log Out</span>
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={() => openAuthModal('selection')}
                                className="text-gray-400 hover:text-white hover:bg-white/10 gap-2"
                            >
                                <User className="h-5 w-5" />
                                <span>Login</span>
                            </Button>
                        )}

                        <div className="md:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white hover:bg-white/10">
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Mobile Search Bar - Outside Menu, Hidden for Admin */}
            {!isAdmin && (
                <div className="md:hidden container mx-auto px-4 pb-3">
                    <Search />
                </div>
            )}

            {/* Mobile Nav Drawer & Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="md:hidden fixed inset-y-0 left-0 z-[60] w-[80%] max-w-sm bg-black/60 backdrop-blur-md supports-[backdrop-filter]:bg-black/30 border-r border-white/10 shadow-2xl flex flex-col"
                        >
                            {/* Menu Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <span className="text-xl font-bold text-white">Menu</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Menu Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <nav className="space-y-1">
                                    {/* Show navigation for non-admin users */}
                                    {!isAdmin && (
                                        <>
                                            <Link
                                                href="/"
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all",
                                                    pathname === '/' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                Home
                                            </Link>
                                            <Link
                                                href="/products"
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all",
                                                    pathname === '/products' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                Laptops
                                            </Link>
                                            <Link
                                                href="/about"
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all",
                                                    pathname === '/about' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                About
                                            </Link>
                                            <Link
                                                href="/contact"
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all",
                                                    pathname === '/contact' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                Contact Us
                                            </Link>

                                            {/* Logged-in user specific links */}
                                            {status === 'authenticated' && (
                                                <>
                                                    <div className="my-4 border-t border-white/5"></div>
                                                    <Link
                                                        href="/orders"
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all",
                                                            pathname === '/orders' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                        )}
                                                    >
                                                        <Package className="h-5 w-5" />
                                                        Orders
                                                    </Link>
                                                    <Link
                                                        href="/profile"
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all",
                                                            pathname === '/profile' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                        )}
                                                    >
                                                        <User className="h-5 w-5" />
                                                        Profile
                                                    </Link>
                                                </>
                                            )}
                                        </>
                                    )}

                                    {/* Admin Links */}
                                    {isAdmin && (
                                        <>
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all",
                                                    pathname === '/admin' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/admin/orders"
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all",
                                                    pathname === '/admin/orders' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                Sales
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </div>

                            {/* User Info & Logout - Bottom Section */}
                            {status === 'authenticated' && (
                                <div className="border-t border-white/5 p-4">
                                    <div className="px-2 mb-3">
                                        <p className="text-sm font-semibold text-white truncate">{session?.user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-3 text-base gap-3"
                                        onClick={() => {
                                            setIsOpen(false);
                                            signOut({ callbackUrl: '/' });
                                        }}
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Logout
                                    </Button>
                                </div>
                            )}

                            {/* Login Button for Non-authenticated Users */}
                            {status === 'unauthenticated' && (
                                <div className="border-t border-white/5 p-4">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-4 py-3 text-base gap-3"
                                        onClick={() => {
                                            setIsOpen(false);
                                            openAuthModal('selection');
                                        }}
                                    >
                                        <User className="h-5 w-5" />
                                        Login / Sign Up
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header >
    );
}
