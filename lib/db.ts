import "server-only";
import { PrismaClient } from "@/generated/prisma-postgres";

const globalForDb = globalThis as unknown as { __db?: PrismaClient };

export async function getDb(): Promise<PrismaClient> {
  if (globalForDb.__db) return globalForDb.__db;
  const client = new PrismaClient();
  globalForDb.__db = client;
  return client;
}

export function getProvider(): "postgres" {
  return "postgres";
}
