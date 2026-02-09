import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's role. */
            isAdmin: boolean
            role: string
            id: string
        } & DefaultSession["user"]
    }

    interface User {
        isAdmin?: boolean;
        role?: string;
        id?: string;
    }
}
