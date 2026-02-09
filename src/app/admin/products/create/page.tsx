'use client';

import { createProduct } from '@/lib/actions/admin';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CreateProductPage() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const router = useRouter();

    // State for live preview
    const [previewData, setPreviewData] = useState({
        title: '',
        category: '',
        price: 0,
        discount: 0,
        condition: 'New' as 'New' | 'Used',
        image: '',
        description: '',
        slug: 'preview-slug'
    });

    const [imageCounts, setImageCounts] = useState({
        main: 0,
        additional: 0,
        urls: 0
    });

    const totalImages = imageCounts.main + imageCounts.additional + imageCounts.urls;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setPreviewData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));

        if (name === 'images') {
            const urlCount = value.split(',').map(s => s.trim()).filter(Boolean).length;
            setImageCounts(prev => ({ ...prev, urls: urlCount }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files || files.length === 0) return;

        if (name === 'imageFile') {
            const file = files[0];
            setImageCounts(prev => ({ ...prev, main: 1 }));

            // Create a preview URL for the selected file
            const objectUrl = URL.createObjectURL(file);
            setPreviewData(prev => ({ ...prev, image: objectUrl }));
        } else if (name === 'imagesFiles') {
            setImageCounts(prev => ({ ...prev, additional: files.length }));
        }
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (totalImages > 5) {
            setError(`You have selected ${totalImages} images. Maximum allowed is 5.`);
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData(event.currentTarget);
            const result = await createProduct(formData);

            // If result is returned (error case), handle it
            if (result && !result.success) {
                setError(result.error || 'Failed to create product');
                setSubmitting(false);
            }
            // If no result, redirect happened successfully
        } catch (err: any) {
            // Check for NEXT_REDIRECT error
            if (err.message === 'NEXT_REDIRECT' || err.digest?.startsWith('NEXT_REDIRECT')) {
                // This is normal, allow redirect
                return;
            }
            console.error('Form submission error:', err);
            setError(err.message || 'An unexpected error occurred');
            setSubmitting(false);
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20 px-4 md:px-0">
            <div className="flex items-center gap-2 md:gap-4 mt-4 md:mt-0">
                <Link href="/admin" className={cn(buttonVariants('ghost', 'icon'), "h-9 w-9 md:h-10 md:w-10")}>
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Create New Product</h1>
            </div>

            <div className="flex items-center gap-4 border-b border-white/10 pb-1">
                <button
                    onClick={() => setActiveTab('edit')}
                    className={cn(
                        "px-6 py-3 text-sm font-bold transition-all relative",
                        activeTab === 'edit' ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    Edit Details
                </button>
                <button
                    onClick={() => setActiveTab('preview')}
                    className={cn(
                        "px-6 py-3 text-sm font-bold transition-all relative",
                        activeTab === 'preview' ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    Live Preview
                </button>
            </div>

            <div className="min-h-[600px]">
                {/* Form Side */}
                {activeTab === 'edit' && (
                    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Title</label>
                                <input
                                    name="title"
                                    required
                                    type="text"
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Product Title"
                                    value={previewData.title}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Category</label>
                                <input
                                    name="category"
                                    required
                                    type="text"
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Laptops"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Price ($)</label>
                                <input
                                    name="price"
                                    required
                                    type="number"
                                    step="0.01"
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="99.99"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Discount (%)</label>
                                <input
                                    name="discount"
                                    type="number"
                                    step="1"
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Expiry Date</label>
                                <input name="discountExpiryDate" type="date" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Expiry Time</label>
                                <input name="discountExpiryTime" type="time" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Stock</label>
                                <input name="stock" required type="number" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-400">Condition</label>
                                <div className="flex items-center space-x-6 h-12">
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="New"
                                            defaultChecked
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-500 bg-black/20 border-white/10 focus:ring-blue-500 focus:ring-offset-black"
                                        />
                                        <span className="text-white group-hover:text-blue-400 transition-colors">New</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Used"
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-orange-500 bg-black/20 border-white/10 focus:ring-orange-500 focus:ring-offset-black"
                                        />
                                        <span className="text-white group-hover:text-orange-400 transition-colors">Used</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Upload Main Image</label>
                                <input name="imageFile" type="file" onChange={handleFileChange} accept="image/*" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
                                <p className="text-[10px] text-gray-500">Or enter URL below</p>
                                <input
                                    name="image"
                                    type="text"
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Upload Additional Images</label>
                                <input name="imagesFiles" type="file" onChange={handleFileChange} accept="image/*" multiple className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
                                <p className="text-[10px] text-gray-500">Or comma-separated URLs below</p>
                                <textarea name="images" rows={1} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs" placeholder="url1, url2" />
                            </div>
                        </div>

                        <div className={cn(
                            "p-3 rounded-lg border text-sm flex justify-between items-center",
                            totalImages > 5 ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-blue-500/10 border-blue-500/50 text-blue-400"
                        )}>
                            <p>Total Images Selected: <strong>{totalImages}</strong></p>
                            <p className="text-xs">{totalImages > 5 ? "⚠️ Limit exceeded (Max 5)" : "Max 5 images allowed"}</p>
                        </div>

                        {error && (
                            <div className="p-4 rounded-lg border bg-red-500/10 border-red-500/50 text-red-400">
                                <p className="font-semibold">Error:</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Description (Markdown Supported)</label>
                            <textarea
                                name="description"
                                required
                                rows={8}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                placeholder="Use Markdown: **bold**, - lists, # headings..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Link href="/admin" className={buttonVariants('ghost')}>
                                Cancel
                            </Link>
                            <Button type="submit" disabled={submitting || totalImages > 5}>
                                {submitting ? 'Creating...' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                    <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start animate-in zoom-in-95 duration-300">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-white font-bold text-sm px-2">
                                <Eye className="w-4 h-4 text-blue-400" />
                                Card Preview
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex justify-center shadow-2xl">
                                <div className="w-full max-w-[300px]">
                                    <ProductCard
                                        product={{
                                            ...previewData,
                                            _id: 'preview',
                                            title: previewData.title || 'Product Title Preview',
                                            images: previewData.image ? [previewData.image] : ['/images/placeholder.jpg'],
                                            rating: 0,
                                            numReviews: 0,
                                            stock: 0,
                                        }}
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 text-center italic">
                                How your product appears in the shop grid.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-white font-bold text-sm px-2">
                                <Eye className="w-4 h-4 text-green-400" />
                                Full Description Preview
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm min-h-[400px] shadow-2xl">
                                <div className="prose prose-invert max-w-none">
                                    {previewData.description ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {previewData.description}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-gray-500 italic">No description provided yet...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
