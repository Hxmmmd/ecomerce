import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getProducts, deleteProduct } from '@/lib/actions/admin';
import { Plus, Edit, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Search from '@/components/Search';

import ProductFilters from '@/components/ProductFilters';

export default async function AdminDashboard({
    searchParams
}: {
    searchParams: Promise<{ q?: string, condition?: string, category?: string, minPrice?: string, maxPrice?: string }>
}) {
    const params = await searchParams;
    const products = await getProducts({
        query: params.q,
        condition: params.condition,
        category: params.category,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-white tracking-tight">Products Management</h1>

                <div className="flex flex-1 max-w-2xl items-center justify-end gap-4">
                    <Search isAdmin className="max-w-md" />

                    <Link href="/admin/orders" className="flex-shrink-0">
                        <Button variant="outline" className="flex items-center gap-2 border-white/10 hover:bg-white/5">
                            <ShoppingBag className="w-4 h-4" /> View Orders
                        </Button>
                    </Link>

                    <Link href="/admin/products/create" className="flex-shrink-0">
                        <Button className="flex items-center gap-2 shadow-lg shadow-blue-900/40">
                            <Plus className="w-4 h-4" /> Add New
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-8">
                {/* Sidebar Filters */}
                <aside>
                    <ProductFilters />
                </aside>

                {/* Products Table Area */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="p-4 text-sm font-medium text-gray-400">Image</th>
                                    <th className="p-4 text-sm font-medium text-gray-400">Name</th>
                                    <th className="p-4 text-sm font-medium text-gray-400">Cond.</th>
                                    <th className="p-4 text-sm font-medium text-gray-400">Category</th>
                                    <th className="p-4 text-sm font-medium text-gray-400">Price</th>
                                    <th className="p-4 text-sm font-medium text-gray-400">Values</th>
                                    <th className="p-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            No products found. Start by creating one.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product._id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-800">
                                                    <Image
                                                        src={product.images?.[0] || '/images/placeholder.jpg'}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-white">{product.title}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${product.condition === 'New' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                                                    }`}>
                                                    {product.condition || 'New'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400">{product.category}</td>
                                            <td className="p-4 text-white">
                                                {product.discount > 0 ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-red-400">-{product.discount}%</span>
                                                        <span>${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    <span>${product.price}</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">
                                                Stock: {product.stock} <br />
                                                Rating: {product.rating || 'N/A'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/products/${product._id}/edit`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-500/20 hover:text-blue-400">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <form action={async () => {
                                                        'use server';
                                                        await deleteProduct(product._id);
                                                    }}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
