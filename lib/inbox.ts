import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAdminSession, logActivity } from "@/lib/admin-guard";

const STATUSES = ["new", "seen", "done"];

function handler(model: "bookingRequest" | "contactMessage", entity: string) {
  async function GET() {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ ok: false }, { status: 401 });
    const db = await getDb();
    const items = await (db[model] as unknown as {
      findMany: (a: Record<string, unknown>) => Promise<unknown[]>;
    }).findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    return NextResponse.json({ ok: true, items });
  }

  async function PUT(req: Request) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ ok: false }, { status: 401 });
    const id = new URL(req.url).searchParams.get("id") ?? "";
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const status = typeof body?.status === "string" ? body.status : "";
    if (!id || !STATUSES.includes(status)) return NextResponse.json({ ok: false }, { status: 400 });
    const db = await getDb();
    await (db[model] as unknown as {
      update: (a: Record<string, unknown>) => Promise<unknown>;
    }).update({ where: { id }, data: { status } });
    await logActivity(session.sub, "update", entity, id, status);
    return NextResponse.json({ ok: true });
  }

  async function DELETE(req: Request) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ ok: false }, { status: 401 });
    const id = new URL(req.url).searchParams.get("id") ?? "";
    if (!id) return NextResponse.json({ ok: false }, { status: 400 });
    const db = await getDb();
    await (db[model] as unknown as {
      delete: (a: Record<string, unknown>) => Promise<unknown>;
    }).delete({ where: { id } });
    await logActivity(session.sub, "delete", entity, id, "");
    return NextResponse.json({ ok: true });
  }

  return { GET, PUT, DELETE };
}

export const bookings = () => handler("bookingRequest", "booking");
export const messages = () => handler("contactMessage", "message");
