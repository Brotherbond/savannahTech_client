import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import routes from "@/lib/routes";
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.NEXTAUTH_JWT_AGE!) || 1209600,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        return { ...credentials };
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      return { ...session, token: token?.token };
    },
  },
  events: {
    async signOut({ token }) { },
  },
  pages: {
    signOut: routes.auth.logout,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
