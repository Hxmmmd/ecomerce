'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

import { ChevronRight, Lock } from 'lucide-react';

import FullScreenLoader from '@/components/ui/FullScreenLoader';

export default function CartCheckoutButton() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = () => {
        if (!session) {
            setIsAuthModalOpen(true);
        } else {
            setIsLoading(true);
            router.push('/checkout');
        }
    };

    return (
        <>
            <FullScreenLoader isLoading={isLoading} />
            <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full py-5 rounded-xl bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 group text-[10px]"
            >
                {isLoading ? 'Processing...' : 'Checkout'} <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isLoading ? 'hidden' : ''}`} />
            </Button>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    setIsLoading(true);
                    router.push('/checkout');
                }}
            />
        </>
    );
}
