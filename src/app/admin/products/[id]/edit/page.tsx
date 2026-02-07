'use client';

import { updateProduct, getProduct } from '@/lib/actions/admin';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [submitting, setSubmitting] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [imageCounts, setImageCounts] = useState({
        main: 0,
        additional: 0,
        urls: 0
    });

    const totalImages = imageCounts.main + imageCounts.additional + imageCounts.urls;

    useEffect(() => {
        async function fetchProduct() {
            const data = await getProduct(id);
            if (!data) return notFound();
            setProduct(data);

            // Initialize image counts
            const mainCount = (data.images?.[0] || data.image) ? 1 : 0;
            const additionalUrls = data.images || [];
            setImageCounts({
                main: mainCount,
                additional: 0,
                urls: additionalUrls.length
            });

            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'images') {
            const urlCount = value.split(',').map(s => s.trim()).filter(Boolean).length;
            setImageCounts(prev => ({ ...prev, urls: urlCount }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files) return;

        if (name === 'imageFile') {
            setImageCounts(prev => ({ ...prev, main: files.length > 0 ? 1 : 0 }));
        } else if (name === 'imagesFiles') {
            setImageCounts(prev => ({ ...prev, additional: files.length }));
        }
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (totalImages > 5) {
            alert(`Maximum 5 images allowed. You have ${totalImages}.`);
            return;
        }

        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        await updateProduct(id, formData);
    }

    if (loading) return <div className="p-8 text-center text-gray-400">Loading product data...</div>;
    if (!product) return notFound();

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin" className={cn(buttonVariants('ghost', 'icon'))}>
                    <ChevronLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-3xl font-bold text-white">Edit Product</h1>
            </div>

            <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Title</label>
                            <input defaultValue={product.title} name="title" required type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Category</label>
                            <input defaultValue={product.category} name="category" required type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Price ($)</label>
                            <input defaultValue={product.price} name="price" required type="number" step="0.01" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Discount (%)</label>
                            <input defaultValue={product.discount} name="discount" type="number" step="1" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Expiry Date</label>
                            <input
                                defaultValue={product.discountExpiry ? product.discountExpiry.substring(0, 10) : ''}
                                name="discountExpiryDate"
                                type="date"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Expiry Time</label>
                            <input
                                defaultValue={product.discountExpiry ? new Date(product.discountExpiry).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '00:00'}
                                name="discountExpiryTime"
                                type="time"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Stock</label>
                            <input defaultValue={product.stock} name="stock" required type="number" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-400">Condition</label>
                            <div className="flex items-center space-x-6 h-12">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="radio" name="condition" value="New" defaultChecked={product.condition === 'New'} className="w-4 h-4 text-blue-500 bg-black/20 border-white/10 focus:ring-blue-500 focus:ring-offset-black" />
                                    <span className="text-white group-hover:text-blue-400 transition-colors">New Laptop</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="radio" name="condition" value="Used" defaultChecked={product.condition === 'Used'} className="w-4 h-4 text-orange-500 bg-black/20 border-white/10 focus:ring-orange-500 focus:ring-offset-black" />
                                    <span className="text-white group-hover:text-orange-400 transition-colors">Used Laptop</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Update Main Image</label>
                            <input name="imageFile" type="file" onChange={handleFileChange} accept="image/*" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
                            <p className="text-[10px] text-gray-500 italic truncate">Current: {product.images?.[0] || 'None'}</p>
                            <input defaultValue={product.images?.[0] || ''} name="image" type="text" onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs" placeholder="Or enter URL" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Update Gallery Images</label>
                            <input name="imagesFiles" type="file" onChange={handleFileChange} accept="image/*" multiple className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
                            <p className="text-[10px] text-gray-500 italic truncate">Separate by comma</p>
                            <textarea defaultValue={product.images?.join(', ')} name="images" rows={1} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs" placeholder="Or comma-separated URLs" />
                        </div>
                    </div>

                    <div className={cn(
                        "p-3 rounded-lg border text-sm flex justify-between items-center",
                        totalImages > 5 ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-blue-500/10 border-blue-500/50 text-blue-400"
                    )}>
                        <p>Total Images In Review: <strong>{totalImages}</strong></p>
                        <p className="text-xs">{totalImages > 5 ? "⚠️ Limit exceeded (Max 5)" : "Max 5 images allowed"}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Description</label>
                        <textarea defaultValue={product.description} name="description" required rows={4} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Link href="/admin" className={buttonVariants('ghost')}>
                            Cancel
                        </Link>
                        <Button type="submit" disabled={submitting || totalImages > 5}>
                            {submitting ? 'Updating...' : 'Update Product'}
                        </Button>
                    </div>
                </form>

                {/* Live Preview Side */}
                <div className="hidden lg:block sticky top-24">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white">Live Preview</h2>
                        <div className="scale-95 origin-top">
                            <div className="relative group bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden">
                                <div className="aspect-[4/3] relative overflow-hidden bg-white/5">
                                    <img
                                        src={product.images?.[0] || '/images/placeholder.jpg'}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-4 space-y-2">
                                    <h3 className="text-white font-medium truncate">{product.title || 'Product Title'}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-400 font-bold">${product.price || '0.00'}</span>
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase">{product.category || 'Category'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">Preview shows current saved state</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
