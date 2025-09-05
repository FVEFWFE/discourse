import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      isPaid?: boolean;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    isPaid?: boolean;
    // ...other properties
    // role: UserRole;
  }
}

const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      // Check if user has active subscription
      let isPaid = false;
      if (token.sub) {
        const activeSubscription = await db.subscription.findFirst({
          where: {
            userId: token.sub,
            status: "ACTIVE",
            endDate: { gte: new Date() }
          }
        });
        isPaid = !!activeSubscription;
      }
      
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub!,
          username: token.username as string,
          isPaid,
        },
      };
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.username = user.username;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const creds = loginSchema.parse(credentials);

        const user = await db.user.findUnique({
          where: { username: creds.username },
        });

        if (!user) {
          // For security, don't reveal whether username exists
          return null;
        }

        // In production, we'd check against a hashed password
        // For MVP, we'll use a simple check (you should implement proper auth)
        const isValidPassword = await bcrypt.compare(creds.password, user.password ?? "");

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          image: user.image,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);