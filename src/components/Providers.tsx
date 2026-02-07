'use client';

import { CartProvider } from '@/lib/context/CartContext';
import { SessionProvider } from 'next-auth/react';
import { AuthModalProvider, useAuthModal } from '@/lib/context/AuthModalContext';
import AuthModal from '@/components/AuthModal';

// Separate component to consume the context
function AuthModalWrapper() {
    const { isOpen, closeAuthModal, mode } = useAuthModal();
    return <AuthModal isOpen={isOpen} onClose={closeAuthModal} initialMode={mode} key={isOpen ? 'open' : 'closed'} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthModalProvider>
                <CartProvider>
                    {children}
                    <AuthModalWrapper />
                </CartProvider>
            </AuthModalProvider>
        </SessionProvider>
    );
}
