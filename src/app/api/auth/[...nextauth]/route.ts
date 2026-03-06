import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/admin/login',
    },
    callbacks: {
        async signIn({ user, account, profile }: any) {
            // Allow specific emails only
            const allowedEmails = [
                "saidpiecebhutan@gmail.com",
                "guruwangchuk7@gmail.com"
            ];

            if (user.email && allowedEmails.includes(user.email)) {
                return true;
            }
            return false; // Access denied
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
