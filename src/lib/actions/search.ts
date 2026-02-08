'use server';

import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    await dbConnect();

    // Use regex for partial matching instead of text search
    // This allows "mac" to find "macbook"
    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(sanitizedQuery, 'i');

    const products = await Product.find({
        $or: [
            { title: { $regex: regex } },
            { category: { $regex: regex } },
            { description: { $regex: regex } }
        ]
    })
        .select('title images price slug category condition') // Only select needed fields
        .limit(5)
        .lean();

    return products.map(product => ({
        _id: product._id.toString(),
        title: product.title,
        name: product.title,
        image: product.images?.[0] || '/images/placeholder.jpg',
        price: product.price,
        slug: product.slug,
        category: product.category,
        condition: product.condition,
    }));
}

