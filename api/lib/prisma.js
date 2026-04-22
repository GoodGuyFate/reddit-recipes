import { PrismaClient } from '../../prisma/generated/prisma/client/index.js';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

globalForPrisma.prisma = prisma;