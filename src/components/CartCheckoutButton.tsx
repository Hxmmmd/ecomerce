'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

import { ChevronRight, Lock } from 'lucide-react';

export default function CartCheckoutButton() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleCheckout = () => {
        if (!session) {
            setIsAuthModalOpen(true);
        } else {
            router.push('/checkout');
        }
    };

    return (
        <>
            <Button
                onClick={handleCheckout}
                className="w-full py-5 rounded-xl bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 group text-[10px]"
            >
                Checkout <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => router.push('/checkout')}
            />
        </>
    );
}
