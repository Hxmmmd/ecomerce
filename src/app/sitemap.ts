import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://levric.vercel.app';

    // Static routes
    const routes = [
        '',
        '/products',
        '/about',
        '/contact',
        '/sale',
        '/shipping',
        '/returns',
        '/privacy'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic product routes
    try {
        await dbConnect();
        const products = await Product.find({}).select('slug updatedAt').lean();

        const productEntries = products.map((product: any) => ({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...routes, ...productEntries];
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return routes;
    }
}
