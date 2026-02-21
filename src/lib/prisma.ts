// @ts-ignore - Import directly from generated client
import { PrismaClient } from '../../.prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: any };

// Lazy initialize Prisma - prevents instantiation during build
function getPrismaInstance() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const prismaClient = new (PrismaClient as any)({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  } as any);

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient;
  }

  return prismaClient;
}

// Create a proxy that lazy-initializes Prisma
export const prisma = new Proxy({} as any, {
  get(target, prop) {
    const instance = getPrismaInstance();
    return Reflect.get(instance, prop);
  },
});
