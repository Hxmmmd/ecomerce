import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

export const authConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdmin = auth?.user?.isAdmin;

            const isRestrictedRoute = nextUrl.pathname.startsWith('/checkout') ||
                nextUrl.pathname.startsWith('/profile') ||
                nextUrl.pathname.startsWith('/orders');

            const isAdminRoute = nextUrl.pathname.startsWith('/admin');

            if (isAdminRoute) {
                if (isLoggedIn && isAdmin) return true;
                return Response.redirect(new URL('/', nextUrl));
            }

            if (isRestrictedRoute) {
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.isAdmin = user.isAdmin;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id;
                session.user.isAdmin = token.isAdmin as boolean;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
