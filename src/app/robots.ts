import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/profile/', '/cart/'],
        },
        sitemap: 'https://levric.vercel.app/sitemap.xml',
    };
}
