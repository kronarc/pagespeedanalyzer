import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from './prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session({ session, user }) {
      // Attach userId and subscriptionStatus to session
      if (session.user) {
        session.user.id = user.id;
        (session.user as any).subscriptionStatus = user.subscriptionStatus;
      }
      return session;
    },
  },
});
