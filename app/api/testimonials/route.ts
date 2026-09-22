import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { notifyAdmin } from "@/lib/notify";

const hits = new Map<string, { count: number; until: number }>();

function allowed(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.until) {
    hits.set(ip, { count: 1, until: now + 60 * 1000 });
    return true;
  }
  rec.count += 1;
  return rec.count <= 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allowed(ip)) return NextResponse.json({ ok: false }, { status: 429 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 1000) : "";
  if (!name || !text) return NextResponse.json({ ok: false }, { status: 400 });
  const rating = Number(body?.rating);
  const db = await getDb();
  await db.testimonial.create({
    data: {
      name,
      text,
      rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.floor(rating))) : 5,
      status: "pending",
    },
  });
  await notifyAdmin("testimonial", `رأي جديد بانتظار الاعتماد: ${name}`);
  return NextResponse.json({ ok: true });
}
