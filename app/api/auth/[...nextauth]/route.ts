import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "email-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Email and OTP required");
        }

        // Call your OTP verification API internally
        const verifyResponse = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/verify-otp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              otp: credentials.otp,
            }),
          }
        );

        if (!verifyResponse.ok) {
          throw new Error("Invalid OTP");
        }

        const { user } = await verifyResponse.json();

        if (!user) {
          throw new Error("User not found");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          sellerId: user.sellerId,
          sellerApproved: user.sellerApproved,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sellerId = user.sellerId;
        token.sellerApproved = user.sellerApproved;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "USER" | "SELLER" | "ADMIN";
        session.user.sellerId = token.sellerId as string | null;
        session.user.sellerApproved = token.sellerApproved as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };