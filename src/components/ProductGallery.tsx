'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    // If no images array, fallback to valid image or empty
    const validImages = images?.length > 0 ? images : ['/images/placeholder.jpg'];
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="space-y-4">
            {/* Main Image Stage */}
            <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10 group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={validImages[selectedIndex]}
                            alt={`${title} - Image ${selectedIndex + 1}`}
                            fill
                            className="object-contain p-4"
                            priority={selectedIndex === 0}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows (Visible on Hover / Mobile) */}
                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" onClick={handlePrevious} className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0 h-10 w-10">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button variant="secondary" size="icon" onClick={handleNext} className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0 h-10 w-10">
                        <ChevronRight className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {validImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all snap-start ${selectedIndex === idx
                                ? 'border-blue-500 opacity-100 ring-2 ring-blue-500/20'
                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
