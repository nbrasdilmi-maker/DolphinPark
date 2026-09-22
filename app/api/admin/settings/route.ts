import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getAdminSession, logActivity } from "@/lib/admin-guard";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const db = await getDb();
  const rows = await db.siteSetting.findMany();
  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.key] = r.value ?? "";
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false }, { status: 400 });
  const db = await getDb();
  for (const [key, raw] of Object.entries(body)) {
    if (!/^[a-z0-9.]+$/i.test(key)) continue;
    const value = typeof raw === "string" ? raw : "";
    await db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  await logActivity(session.sub, "update", "settings", undefined, "");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
