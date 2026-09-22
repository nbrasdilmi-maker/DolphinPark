import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAdminSession, logActivity } from "@/lib/admin-guard";
import { hashPassword } from "@/lib/auth";

const ROLES = ["superadmin", "admin", "editor"];

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const db = await getDb();
  const users = await db.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, username: true, name: true, role: true, lastLoginAt: true, createdAt: true },
  });
  return NextResponse.json({ ok: true, users });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const role = typeof body?.role === "string" ? body.role : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || !name || !ROLES.includes(role) || password.length < 8) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const db = await getDb();
  const exists = await db.adminUser.findUnique({ where: { username } });
  if (exists) return NextResponse.json({ ok: false, error: "exists" }, { status: 409 });
  const user = await db.adminUser.create({
    data: { username, name, role, passwordHash: await hashPassword(password) },
  });
  await logActivity(session.sub, "create", "admin-user", user.id, username);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.role === "string" && ROLES.includes(body.role)) data.role = body.role;
  if (typeof body.password === "string" && body.password.length >= 8) {
    data.passwordHash = await hashPassword(body.password);
  }
  const db = await getDb();
  await db.adminUser.update({ where: { id }, data });
  await logActivity(session.sub, "update", "admin-user", id, "");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id || id === session.sub) return NextResponse.json({ ok: false }, { status: 400 });
  const db = await getDb();
  const target = await db.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ ok: false }, { status: 404 });
  if (target.role === "superadmin") {
    const count = await db.adminUser.count({ where: { role: "superadmin" } });
    if (count <= 1) return NextResponse.json({ ok: false, error: "last" }, { status: 400 });
  }
  await db.adminUser.delete({ where: { id } });
  await logActivity(session.sub, "delete", "admin-user", id, target.username);
  return NextResponse.json({ ok: true });
}
