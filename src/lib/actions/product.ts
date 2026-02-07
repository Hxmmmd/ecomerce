'use server';

import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitReview(productId: string, reviewData: { rating: number, comment: string, images?: string[] }) {
    const session = await auth();
    if (!session || !session.user) throw new Error('Authentication required');

    await dbConnect();

    // 1. Verify that the user has a delivered order for this product
    // Updated for new Order structure: items is array, status field used
    const order = await Order.findOne({
        userId: session.user.id,
        'items.productId': productId,
        status: 'Delivered'
    });

    if (!order) {
        throw new Error('You can only review products that have been delivered to you.');
    }

    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    // 2. Check if user already reviewed
    const existingReviewIndex = product.reviews.findIndex(
        (r: any) => r.user === session.user?.name || r.user === session.user?.email
    );

    if (existingReviewIndex !== -1) {
        // Update existing
        product.reviews[existingReviewIndex].rating = reviewData.rating;
        product.reviews[existingReviewIndex].comment = reviewData.comment;
        product.reviews[existingReviewIndex].images = reviewData.images || [];
        product.reviews[existingReviewIndex].createdAt = new Date();
    } else {
        // Create new
        const review = {
            user: session.user.name || session.user.email,
            rating: reviewData.rating,
            comment: reviewData.comment,
            images: reviewData.images || [],
            createdAt: new Date(),
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
    }

    // 3. Recalculate average rating
    const totalRating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    revalidatePath(`/products/${product.slug}`);
    revalidatePath('/orders');
    return { success: true };
}

export async function getProductReviews(productId: string) {
    await dbConnect();
    const product = await Product.findById(productId).select('reviews rating numReviews').lean();
    return JSON.parse(JSON.stringify(product));
}

