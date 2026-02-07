import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    // Matcher from NextAuth docs: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/checkout/:path*', '/profile/:path*', '/orders/:path*', '/admin/:path*'],
};
