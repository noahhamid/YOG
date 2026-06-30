import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
   debug: true, 
  adapter: {
    createUser: async (data: any) => {
  const { emailVerified, ...rest } = data;
  return prisma.user.create({
    data: {
      ...rest,
      emailVerified: emailVerified ?? null,
    },
  }) as any;
},

    getUser: async (id: string) =>
  prisma.user.findUnique({ where: { id } }) as any,

getUserByEmail: async (email: string) =>
  prisma.user.findUnique({ where: { email } }) as any,

   getUserByAccount: async ({ provider, providerAccountId }: any) => {
  console.log("🔍 prisma.account:", typeof prisma.account);
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: { provider, providerAccountId },
    },
    include: { user: true },
  });
  return account?.user ?? null;
},

   updateUser: async ({ id, ...data }: any) =>
  prisma.user.update({ where: { id }, data }) as any,

deleteUser: async (id: string) =>
  prisma.user.delete({ where: { id } }) as any,
    linkAccount: async (data: any) => prisma.account.create({ data }) as any,

    unlinkAccount: async ({ provider, providerAccountId }: any) =>
      prisma.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      }) as any,

    createSession: async (data: any) => prisma.session.create({ data }),

    getSessionAndUser: async (sessionToken: string) => {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!session) return null;
      const { user, ...sessionData } = session;
      return { session: sessionData, user };
    },

    updateSession: async (data: any) =>
      prisma.session.update({
        where: { sessionToken: data.sessionToken },
        data,
      }),

    deleteSession: async (sessionToken: string) =>
      prisma.session.delete({ where: { sessionToken } }),

    createVerificationToken: async (data: any) =>
      prisma.verificationToken.create({ data }),

    useVerificationToken: async ({ identifier, token }: any) =>
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      }),
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: (credentials.email as string).toLowerCase() },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
});