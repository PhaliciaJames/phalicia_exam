// lib/db.ts
import { PrismaClient } from '@prisma/client';

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
export const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = db;