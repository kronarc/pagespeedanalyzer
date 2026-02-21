import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    subscriptionStatus?: string;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      subscriptionStatus?: string;
    };
  }
}
