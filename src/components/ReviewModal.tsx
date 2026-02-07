'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { Star, X, Loader2, Camera, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitReview } from '@/lib/actions/product';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        _id: string;
        title: string;
        images?: string[];
        image?: string;
    };
    existingReview?: {
        rating: number;
        comment: string;
        images: string[];
    };
}

export default function ReviewModal({ isOpen, onClose, product, existingReview }: ReviewModalProps) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [images, setImages] = useState<string[]>(existingReview?.images || []);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!comment.trim()) {
            setError('Please enter a comment');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await submitReview(product._id, { rating, comment, images });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    const addImage = () => {
        if (imageUrl && !images.includes(imageUrl)) {
            setImages([...images, imageUrl]);
            setImageUrl('');
        }
    };

    const removeImage = (url: string) => {
        setImages(images.filter(img => img !== url));
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
                        className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
                    >
                        <button onClick={onClose} className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>

                        <header className="mb-8">
                            <h2 className="text-3xl font-black tracking-tighter mb-2">Write a Review</h2>
                            <div className="flex items-center gap-4">
                                <img src={product.images?.[0] || '/images/placeholder.jpg'} alt={product.title} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                                <p className="text-gray-400 font-bold truncate">{product.title}</p>
                            </div>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Overall Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Your Feedback</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us what you think about the product..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all min-h-[120px] resize-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Share Photos (URLs)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="Paste image URL here..."
                                        className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={addImage}
                                        className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {images.map((url, i) => (
                                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 group">
                                            <img src={url} alt="Review" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(url)}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <X className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
