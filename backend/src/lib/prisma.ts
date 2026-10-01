import { PrismaClient } from '@prisma/client';
import { config } from '../config';

// Singleton para evitar múltiplas conexões
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: config.isDevelopment
      ? ['query', 'error', 'warn']
      : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (config.isDevelopment) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
