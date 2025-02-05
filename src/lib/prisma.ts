import { PrismaClient } from '@prisma/client'

class PrismaClientSingleton {
  private static instance: PrismaClient

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient()
    }
    return PrismaClientSingleton.instance
  }
}

const prisma = PrismaClientSingleton.getInstance()

if (process.env.NODE_ENV !== 'production') {
  const globalForPrisma = globalThis as unknown as {
    prisma: typeof prisma | undefined
  }
  globalForPrisma.prisma = prisma
}

export { prisma }