'use client';

import { Minus, Plus } from 'lucide-react';

interface CartQuantityToggleProps {
    quantity: number;
    max: number;
    onChange: (newQty: number) => void;
}

export default function CartQuantityToggle({ quantity, max, onChange }: CartQuantityToggleProps) {
    return (
        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden self-start">
            <button
                type="button"
                onClick={() => onChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="p-1.5 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <Minus className="w-2.5 h-2.5" />
            </button>
            <span className="w-6 text-center text-[10px] font-black font-mono">
                {quantity}
            </span>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, quantity + 1))}
                disabled={quantity >= max}
                className="p-1.5 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <Plus className="w-2.5 h-2.5" />
            </button>
        </div>
    );
}
