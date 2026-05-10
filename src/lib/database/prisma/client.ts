import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

// In production, reuse one instance. In dev, always create fresh to avoid stale cache after `prisma generate`.
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
    process.env.NODE_ENV === "production"
        ? (globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient()))
        : createPrismaClient();
 