import "server-only";
import { cookies } from "next/headers";
import { verifySession, cookieName, type SessionPayload } from "./auth";
import { getDb } from "./db";

export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(cookieName())?.value ?? "");
}

export async function logActivity(
  userId: string | null,
  action: string,
  entity: string,
  entityId?: string,
  summary?: string
): Promise<void> {
  try {
    const db = await getDb();
    await db.activityLog.create({ data: { userId, action, entity, entityId, summary } });
  } catch {
    return;
  }
}
