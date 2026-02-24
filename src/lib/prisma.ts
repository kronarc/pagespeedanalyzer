import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Truly lazy initialization using a Proxy
// This prevents the PrismaClient constructor from running during build-time static analysis
let _prisma: any;

export const prisma = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'constructor') return Object.prototype.constructor;
    
    if (!_prisma) {
      if (process.env.NODE_ENV === 'production') {
        _prisma = prismaClientSingleton();
      } else {
        if (!globalThis.prismaGlobal) {
          globalThis.prismaGlobal = prismaClientSingleton();
        }
        _prisma = globalThis.prismaGlobal;
      }
    }
    
    return _prisma[prop];
  },
});
