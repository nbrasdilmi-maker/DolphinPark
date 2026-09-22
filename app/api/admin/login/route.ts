import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  verifyPassword,
  signSession,
  cookieName,
  sessionDays,
  loginAllowed,
  registerFailedLogin,
  clearLoginAttempts,
} from "@/lib/auth";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!loginAllowed(ip)) {
    return NextResponse.json({ ok: false, error: "locked" }, { status: 429 });
  }
  const body = (await req.json().catch(() => null)) as {
    username?: unknown;
    password?: unknown;
  } | null;
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || !password) {
    registerFailedLogin(ip);
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = await getDb();
  const user = await db.adminUser.findUnique({ where: { username } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    registerFailedLogin(ip);
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  clearLoginAttempts(ip);
  await db.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await db.activityLog
    .create({
      data: {
        userId: user.id,
        action: "login",
        entity: "admin",
        entityId: user.id,
        summary: user.username,
      },
    })
    .catch(() => null);
  const token = await signSession({ sub: user.id, username: user.username, role: user.role });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionDays() * 86400,
  });
  return res;
}
