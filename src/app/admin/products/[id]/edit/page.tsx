'use client';

import { updateProduct, getProduct } from '@/lib/actions/admin';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, Eye, X } from 'lucide-react';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [submitting, setSubmitting] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

    const [imageCounts, setImageCounts] = useState({
        main: 0,
        additional: 0,
        urls: 0
    });

    const [previewData, setPreviewData] = useState<any>({
        title: '',
        category: '',
        price: 0,
        discount: 0,
        condition: 'New',
        image: '',
        images: [],
        description: '',
        slug: ''
    });

    const [managedImages, setManagedImages] = useState<string[]>([]);

    const totalImages = imageCounts.main + imageCounts.additional + imageCounts.urls;

    useEffect(() => {
        async function fetchProduct() {
            const data = await getProduct(id);
            if (!data) return notFound();
            setProduct(data);
            const initialImages = data.images || [];
            setManagedImages(initialImages);

            setPreviewData({
                title: data.title,
                category: data.category,
                price: data.price,
                discount: data.discount,
                condition: data.condition,
                image: initialImages[0] || '',
                images: initialImages,
                description: data.description,
                slug: data.slug
            });

            // Initialize image counts
            const mainCount = initialImages[0] ? 1 : 0;
            setImageCounts({
                main: mainCount,
                additional: 0,
                urls: initialImages.length
            });

            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        const updatedValue = type === 'number' ? Number(value) : value;
        setPreviewData((prev: any) => ({
            ...prev,
            [name]: updatedValue
        }));

        if (name === 'images') {
            const urls = value.split(',').map(s => s.trim()).filter(Boolean);
            setManagedImages(urls);
            setImageCounts(prev => ({ ...prev, urls: urls.length }));
            setPreviewData((prev: any) => ({ ...prev, image: urls[0] || '', images: urls }));
        }
    };

    const removeImage = (indexToRemove: number) => {
        const updatedImages = managedImages.filter((_, index) => index !== indexToRemove);
        setManagedImages(updatedImages);
        setImageCounts(prev => ({ ...prev, urls: updatedImages.length }));
        setPreviewData((prev: any) => ({
            ...prev,
            image: updatedImages[0] || '',
            images: updatedImages
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files || files.length === 0) return;

        if (name === 'imageFile') {
            const file = files[0];
            setImageCounts(prev => ({ ...prev, main: 1 }));
            const objectUrl = URL.createObjectURL(file);
            setManagedImages(prev => {
                const newArr = [...prev];
                newArr[0] = objectUrl;
                return newArr;
            });
            setPreviewData((prev: any) => ({ ...prev, image: objectUrl }));
        } else if (name === 'imagesFiles') {
            setImageCounts(prev => ({ ...prev, additional: files.length }));
            const fileUrls = Array.from(files).map(f => URL.createObjectURL(f));
            setManagedImages(prev => [...prev, ...fileUrls]);
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
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20 px-4 md:px-0">
            <div className="flex items-center gap-2 md:gap-4 mt-4 md:mt-0">
                <Link href="/admin" className={cn(buttonVariants('ghost', 'icon'), "h-9 w-9 md:h-10 md:w-10")}>
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Product</h1>
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
                    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-8 space-y-6 shadow-2xl animate-in fade-in duration-300">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Title</label>
                                <input defaultValue={product.title} name="title" required type="text" onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Category</label>
                                <input defaultValue={product.category} name="category" required type="text" onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Price ($)</label>
                                <input defaultValue={product.price} name="price" required type="number" step="0.01" onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Discount (%)</label>
                                <input defaultValue={product.discount} name="discount" type="number" step="1" onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                                <input defaultValue={product.stock} name="stock" required type="number" onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-400">Condition</label>
                                <div className="flex items-center space-x-6 h-12">
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input type="radio" name="condition" value="New" defaultChecked={product.condition === 'New'} onChange={handleInputChange} className="w-4 h-4 text-blue-500 bg-black/20 border-white/10 focus:ring-blue-500 focus:ring-offset-black" />
                                        <span className="text-white group-hover:text-blue-400 transition-colors">New Laptop</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input type="radio" name="condition" value="Used" defaultChecked={product.condition === 'Used'} onChange={handleInputChange} className="w-4 h-4 text-orange-500 bg-black/20 border-white/10 focus:ring-orange-500 focus:ring-offset-black" />
                                        <span className="text-white group-hover:text-orange-400 transition-colors">Used Laptop</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-gray-400">Main Product Image (Upload or URL)</label>
                                <div className="space-y-2">
                                    <input name="imageFile" type="file" onChange={handleFileChange} accept="image/*" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
                                    <div className="relative group">
                                        <input
                                            value={managedImages[0] || ''}
                                            name="image"
                                            type="text"
                                            onChange={(e) => {
                                                const newUrl = e.target.value;
                                                const newImages = [...managedImages];
                                                newImages[0] = newUrl;
                                                setManagedImages(newImages.filter(Boolean));
                                                handleInputChange(e);
                                            }}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs overflow-x-auto whitespace-nowrap"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-gray-400">Additional Gallery Images (Comma-separated URLs)</label>
                                <textarea
                                    value={managedImages.join(', ')}
                                    name="images"
                                    rows={3}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono scrollbar-thin scrollbar-thumb-white/10"
                                    placeholder="url1, url2, url3..."
                                />
                            </div>
                        </div>

                        {/* Visual Image Manager */}
                        {managedImages.length > 0 && (
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-400">Manage Uploaded Images (Select to remove)</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {managedImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group bg-black/40">
                                            <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                            {/* Delete Button - Optimized for Mobile & Desktop */}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 md:inset-0 bg-red-600 md:bg-red-600/60 md:opacity-0 md:group-hover:opacity-100 transition-all flex items-center justify-center text-white p-1.5 md:p-0 rounded-full md:rounded-none shadow-lg md:shadow-none"
                                                title="Remove Image"
                                            >
                                                <X className="w-4 h-4 md:w-6 md:h-6" />
                                            </button>
                                            <div className="absolute top-1 left-1 bg-black/60 text-[8px] px-1.5 py-0.5 rounded text-white font-bold">
                                                {idx === 0 ? 'MAIN' : `GALLERY ${idx}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={cn(
                            "p-3 rounded-lg border text-sm flex justify-between items-center",
                            totalImages > 5 ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-blue-500/10 border-blue-500/50 text-blue-400"
                        )}>
                            <p>Total Images In Review: <strong>{totalImages}</strong></p>
                            <p className="text-xs">{totalImages > 5 ? "⚠️ Limit exceeded (Max 5)" : "Max 5 images allowed"}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Description (Markdown Supported)</label>
                            <textarea
                                defaultValue={product.description}
                                name="description"
                                required
                                rows={8}
                                onChange={handleInputChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            />
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
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                    <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start animate-in zoom-in-95 duration-300 px-4 md:px-0 mt-6">
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
                                            _id: product._id,
                                            title: previewData.title || 'Product Title',
                                            images: previewData.image ? [previewData.image] : (product.images?.[0] ? [product.images[0]] : ['/images/placeholder.jpg']),
                                            rating: product.rating || 0,
                                            numReviews: product.numReviews || 0,
                                            stock: previewData.stock || 0,
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
