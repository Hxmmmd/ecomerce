'use server';

import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';

export async function syncCart(cartItems: { _id: string, qty: number }[]) {
    const session = await auth();
    if (!session || !session.user) return { success: false, error: 'Not authenticated' };

    await dbConnect();

    // Find existing cart or create new
    let cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
        cart = new Cart({ userId: session.user.id, items: [] });
    }

    // Overwrite with local cart items (simple sync strategy: local wins)
    // Or merge if needed. For now simplest is replace or merge. 
    // Given "sync", often implies taking the provided state.
    cart.items = cartItems.map(item => ({
        productId: item._id,
        quantity: item.qty
    }));

    await cart.save();
    return { success: true };
}

export async function getCart() {
    const session = await auth();
    if (!session || !session.user) return { success: false, items: [] };

    await dbConnect();

    // Optimize: Select only required fields during populate
    const cart = await Cart.findOne({ userId: session.user.id })
        .populate({
            path: 'items.productId',
            select: '_id title slug images price stock' // Only fetch needed fields
        });

    if (!cart || !cart.items) return { success: true, items: [] };

    const items = cart.items
        .filter((item: any) => item.productId != null)
        .map((item: any) => {
            const p = item.productId;
            return {
                _id: p._id.toString(),
                title: p.title,
                slug: p.slug,
                image: p.images[0],
                price: p.price,
                qty: item.quantity,
                stock: p.stock
            };
        });

    return { success: true, items };
}

export async function clearCart() {
    const session = await auth();
    if (!session || !session.user) return { success: false, error: 'Not authenticated' };

    await dbConnect();
    await Cart.findOneAndDelete({ userId: session.user.id });

    revalidatePath('/cart');
    return { success: true };
}

