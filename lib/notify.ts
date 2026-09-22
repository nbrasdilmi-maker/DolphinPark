import "server-only";
import { getDb } from "./db";

export async function notifyAdmin(kind: string, summary: string): Promise<void> {
  try {
    const db = await getDb();
    const row = await db.siteSetting.findUnique({ where: { key: "notify.webhook" } });
    const url = row?.value?.trim();
    if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, summary, at: new Date().toISOString() }),
      signal: ctrl.signal,
    }).catch(() => null);
    clearTimeout(timer);
  } catch {
    return;
  }
}
