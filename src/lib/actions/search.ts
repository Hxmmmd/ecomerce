'use server';

import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    await dbConnect();

    // Use text search index for better performance
    const products = await Product.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
    )
        .select('title images price slug category condition') // Only select needed fields
        .sort({ score: { $meta: 'textScore' } }) // Sort by relevance
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

