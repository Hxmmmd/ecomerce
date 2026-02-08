'use server';

import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import Order from '@/models/Order';

export async function getProducts(params: { query?: string, condition?: string, category?: string, minPrice?: string, maxPrice?: string } = {}) {
    await dbConnect();
    const filter: any = {};

    if (params.query) {
        filter.$or = [
            { title: { $regex: params.query, $options: 'i' } }, // Renamed from name
            { category: { $regex: params.query, $options: 'i' } },
            { condition: { $regex: params.query, $options: 'i' } },
            { description: { $regex: params.query, $options: 'i' } }
        ];
    }

    if (params.condition) filter.condition = params.condition;
    if (params.category) filter.category = params.category;

    // Price filtering logic (simplified for brevity, ensuring it works)
    if (params.minPrice || params.maxPrice) {
        const min = Number(params.minPrice);
        const max = Number(params.maxPrice);

        if (!isNaN(min)) filter.price = { ...filter.price, $gte: min };
        if (!isNaN(max)) filter.price = { ...filter.price, $lte: max };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    return products.map((product: any) => ({
        ...product,
        _id: product._id.toString(),
        createdAt: product.createdAt ? product.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : new Date().toISOString(),
        discountExpiry: product.discountExpiry ? product.discountExpiry.toISOString() : null,
        // Backward comp
        image: product.images?.[0] || '',
        name: product.title,
        countInStock: product.stock
    }));
}

export async function getProduct(id: string) {
    await dbConnect();
    const product: any = await Product.findById(id).lean();
    if (!product) return null;
    return {
        ...product,
        _id: product._id.toString(),
        createdAt: product.createdAt ? product.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : new Date().toISOString(),
        discountExpiry: product.discountExpiry ? product.discountExpiry.toISOString() : null,
        // Map for frontend
        image: product.images?.[0] || '',
        name: product.title,
        countInStock: product.stock
    };
}

async function saveFile(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const relativePath = `/uploads/${fileName}`;
        const absolutePath = path.join(process.cwd(), 'public', 'uploads', fileName);

        await fs.mkdir(path.dirname(absolutePath), { recursive: true });
        await fs.writeFile(absolutePath, buffer);

        console.log('File saved successfully:', relativePath);
        return relativePath;
    } catch (error) {
        console.error('Error saving file:', error);
        throw new Error(`Failed to save file: ${file.name}`);
    }
}

export async function createProduct(formData: FormData) {
    try {
        console.log('Starting product creation...');
        await dbConnect();
        console.log('Database connected');

        const title = (formData.get('title') || formData.get('name')) as string;
        const price = Number(formData.get('price'));
        const discount = Number(formData.get('discount') || 0);
        const expiryDate = formData.get('discountExpiryDate') as string;
        const expiryTime = formData.get('discountExpiryTime') as string;
        const discountExpiry = expiryDate ? new Date(`${expiryDate}T${expiryTime || '00:00'}`) : null;
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const stock = Number(formData.get('stock') || formData.get('countInStock'));
        const condition = formData.get('condition') as string;

        console.log('Form data extracted:', { title, category, price, stock, condition });

        const mainImageFile = formData.get('imageFile') as File;
        let image = formData.get('image') as string;

        console.log('Processing main image...', { hasFile: mainImageFile && mainImageFile.size > 0, hasUrl: !!image });

        if (mainImageFile && mainImageFile.size > 0) {
            console.log('Uploading main image file...');
            image = await saveFile(mainImageFile);
            console.log('Main image uploaded:', image);
        }

        const additionalImageFiles = formData.getAll('imagesFiles') as File[];
        let images = (formData.get('images') as string || '').split(',').map(s => s.trim()).filter(Boolean);

        console.log('Processing additional images...', { fileCount: additionalImageFiles.length, urlCount: images.length });

        if (additionalImageFiles && additionalImageFiles.length > 0) {
            for (const file of additionalImageFiles) {
                if (file.size > 0) {
                    console.log('Uploading additional image file...');
                    const uploadedPath = await saveFile(file);
                    images.push(uploadedPath);
                    console.log('Additional image uploaded:', uploadedPath);
                }
            }
        }

        // Add main image to images array if available
        if (image) {
            images = [image, ...images];
        }

        // Ensure unique images and limit to 5
        images = [...new Set(images)];

        console.log('Total images after processing:', images.length);

        if (images.length > 5) {
            console.error('Too many images:', images.length);
            return { success: false, error: 'Maximum 5 images allowed per product.' };
        }

        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        console.log('Creating product in database...');
        await Product.create({
            title,
            slug,
            price,
            discount,
            discountExpiry,
            images,
            category,
            description,
            stock,
            condition,
            isNewProduct: condition === 'New'
        });

        console.log('Product created successfully');

        revalidatePath('/admin');
        revalidatePath('/products');
        redirect('/admin');
    } catch (error: any) {
        console.error('Error creating product:', error);
        return { success: false, error: error.message || 'Failed to create product' };
    }
}

export async function updateProduct(id: string, formData: FormData) {
    await dbConnect();

    const title = (formData.get('title') || formData.get('name')) as string;
    const price = Number(formData.get('price'));
    const discount = Number(formData.get('discount') || 0);
    const expiryDate = formData.get('discountExpiryDate') as string;
    const expiryTime = formData.get('discountExpiryTime') as string;
    const discountExpiry = expiryDate ? new Date(`${expiryDate}T${expiryTime || '00:00'}`) : null;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const stock = Number(formData.get('stock') || formData.get('countInStock'));
    const condition = formData.get('condition') as string;

    const mainImageFile = formData.get('imageFile') as File;
    let image = formData.get('image') as string;

    if (mainImageFile && mainImageFile.size > 0) {
        image = await saveFile(mainImageFile);
    }

    const additionalImageFiles = formData.getAll('imagesFiles') as File[];
    let images = (formData.get('images') as string || '').split(',').map(s => s.trim()).filter(Boolean);

    if (additionalImageFiles && additionalImageFiles.length > 0) {
        for (const file of additionalImageFiles) {
            if (file.size > 0) {
                const uploadedPath = await saveFile(file);
                images.push(uploadedPath);
            }
        }
    }

    // Add main image to images array if available
    if (image) {
        images = [image, ...images];
    }

    // Ensure unique images and limit to 5
    images = [...new Set(images)];

    if (images.length > 5) {
        throw new Error('Maximum 5 images allowed per product.');
    }

    await Product.findByIdAndUpdate(id, {
        title,
        price,
        discount,
        discountExpiry,
        images,
        category,
        description,
        stock,
        condition,
        isNewProduct: condition === 'New'
    });

    revalidatePath('/admin');
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    redirect('/admin');
}

export async function deleteProduct(id: string) {
    await dbConnect();
    await Product.findByIdAndDelete(id);
    revalidatePath('/admin');
    revalidatePath('/products');
}

export async function getOrders() {
    const { unstable_noStore: noStore } = await import('next/cache');
    noStore();
    await dbConnect();

    const orders = await Order.find({
        status: { $nin: ['Cancelled', 'Rejected'] }
    })
        .populate('userId', 'name email')
        .populate('items.productId')
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(orders));
}

export async function updateOrderStatus(id: string, status: { isPaid?: boolean, isDelivered?: boolean }) {
    try {
        await dbConnect();
        const update: any = {};
        if (status.isDelivered) {
            update.status = 'Delivered';
        }
        await Order.findByIdAndUpdate(id, { $set: update });
        revalidatePath('/admin/orders');
        revalidatePath('/orders');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateTrackingStatus(id: string, status: string) {
    try {
        await dbConnect();

        // We need to fetch the order first to check conditions (COD, etc), 
        // but we use lean() to avoid full hydration/validation at this stage if possible,
        // or just findById is fine, but we won't call .save() on it.
        const order = await Order.findById(id).lean();

        if (!order) return { success: false, error: 'Order not found' };

        const statusMessages: any = {
            'Packing': 'Apka product ki packing ho rahi hai abhi',
            'Shipped': 'Apka product humare warehouse se nikal gaya hai',
            'Out for Delivery': 'Apka product humare delivery partners le ke nikal chuke hain itne time tak pouch jaye ga',
            'Delivered': 'You received your package'
        };

        const updateFields: any = {
            status: status
        };

        if (status === 'Delivered') {
            updateFields.deliveredAt = new Date();
            if (order.paymentMethod === 'COD') {
                updateFields.paymentStatus = 'Completed';
            }
        }

        const trackingEntry = {
            status,
            timestamp: new Date(),
            message: statusMessages[status] || `Status updated to ${status}`
        };

        await Order.findByIdAndUpdate(id, {
            $set: updateFields,
            $push: { trackingHistory: trackingEntry }
        });

        revalidatePath('/admin/orders');
        revalidatePath(`/orders/${id}/track`);
        revalidatePath('/orders');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error('Update Tracking Error:', error);
        return { success: false, error: error.message };
    }
}

export async function rejectOrder(id: string) {
    try {
        await dbConnect();
        // Use lean() for performance and to bypass full hydration since we rely on explicit updates
        const order = await Order.findById(id).lean();

        if (!order) return { success: false, error: 'Order not found' };
        if (order.status === 'Rejected') return { success: false, error: 'Order is already rejected' };
        if (order.status === 'Delivered') return { success: false, error: 'Cannot reject a delivered order' };

        // Restore stock levels
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: {
                    stock: item.quantity,
                    numSales: -item.quantity
                }
            });
        }

        const trackingEntry = {
            status: 'Rejected',
            timestamp: new Date(),
            message: 'Order was rejected by admin'
        };

        // Use findByIdAndUpdate to bypass strict schema validation that might fail on .save() for legacy docs
        await Order.findByIdAndUpdate(id, {
            $set: { status: 'Rejected' },
            $push: { trackingHistory: trackingEntry }
        });

        revalidatePath('/admin/orders');
        revalidatePath('/orders');
        revalidatePath(`/orders/${id}/track`);
        revalidatePath(`/products`);
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
