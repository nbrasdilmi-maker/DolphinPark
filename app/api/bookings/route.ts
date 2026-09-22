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
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  if (!name || !phone) return NextResponse.json({ ok: false }, { status: 400 });
  const type = typeof body?.type === "string" ? body.type.slice(0, 120) : null;
  const guests = Number(body?.guests);
  const date = typeof body?.date === "string" ? body.date.slice(0, 40) : null;
  const message = typeof body?.message === "string" ? body.message.slice(0, 2000) : null;
  const db = await getDb();
  await db.bookingRequest.create({
    data: {
      name,
      phone,
      type,
      guests: Number.isFinite(guests) && guests > 0 ? Math.floor(guests) : null,
      date,
      message,
    },
  });
  await notifyAdmin("booking", `حجز جديد: ${name} — ${phone}`);
  return NextResponse.json({ ok: true });
}
