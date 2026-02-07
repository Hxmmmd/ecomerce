const data = {
    users: [
        {
            name: 'Admin',
            email: 'admin@example.com',
            password: '123', // In real app, this should be bcrypt hashed. Seed route will hash it.
            role: 'admin',
            isAdmin: true,
        },
        {
            name: 'User',
            email: 'user@example.com',
            password: '123',
            role: 'user',
            isAdmin: false,
        },
    ],
    products: [
        {
            name: 'MacBook Pro 16 M3 Max',
            slug: 'macbook-pro-16-m3-max',
            category: 'Laptops',
            image: '/images/hero-laptop.png',
            images: ['/images/hero-laptop.png', '/images/hero-laptop.png'],
            price: 3499,
            rating: 4.8,
            numReviews: 12,
            numSales: 45,
            countInStock: 5,
            description: 'The most powerful MacBook Pro ever. Blazing-fast M3 Max chip, stunning Liquid Retina XDR display.',
            isFeatured: true,
            condition: 'New' as const,
            isNewProduct: true,
            reviews: [
                { user: 'Ali Ahmed', rating: 5, comment: 'Excellent performance!', images: ['/images/hero-laptop.png'] },
            ]
        },
        {
            name: 'Dell XPS 15',
            slug: 'dell-xps-15',
            category: 'Laptops',
            image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6',
            images: ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6'],
            price: 2199,
            rating: 4.5,
            numReviews: 8,
            numSales: 32,
            countInStock: 8,
            description: 'Immersive display, premium materials, and powerful performance.',
            isFeatured: true,
            condition: 'New' as const,
            isNewProduct: true,
            reviews: [
                { user: 'Sara Khan', rating: 4, comment: 'Good laptop, but battery life could be better.', images: [] },
            ]
        },
    ],
};

export default data;
