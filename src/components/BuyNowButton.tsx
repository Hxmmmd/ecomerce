'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Zap } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

import FullScreenLoader from '@/components/ui/FullScreenLoader';

export default function BuyNowButton({ product }: { product: any }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleBuyNow = () => {
        if (!session) {
            setIsAuthModalOpen(true);
        } else {
            setIsLoading(true);
            router.push(`/checkout?product=${product.slug}`);
        }
    };

    return (
        <>
            <FullScreenLoader isLoading={isLoading} />
            <Button
                onClick={handleBuyNow}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-2 group transition-all active:scale-[0.98] shadow-xl shadow-blue-900/20"
            >
                {isLoading ? (
                    'Processing...'
                ) : (
                    <>
                        <Zap className="w-5 h-5 fill-current transition-transform group-hover:scale-110 group-hover:rotate-12" />
                        <span className="text-lg">Buy Now</span>
                    </>
                )}
            </Button>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    setIsLoading(true);
                    router.push(`/checkout?product=${product.slug}`);
                }}
            />
        </>
    );
}
