import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import firestore from "@/lib/firestore";

export const authOptions = {
    adapter: FirestoreAdapter(firestore),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            if (session?.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
