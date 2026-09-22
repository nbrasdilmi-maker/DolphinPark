import "server-only";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "dp_admin";

export type SessionPayload = {
  sub: string;
  username: string;
  role: string;
};

function secret(): Uint8Array {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < 16) throw new Error("ADMIN_JWT_SECRET is not set");
  return new TextEncoder().encode(s);
}

export function sessionDays(): number {
  const n = Number(process.env.ADMIN_SESSION_DAYS ?? "7");
  return Number.isFinite(n) && n > 0 ? Math.min(n, 30) : 7;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ username: payload.username, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${sessionDays()}d`)
    .sign(secret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.sub !== "string") return null;
    return {
      sub: payload.sub,
      username: typeof payload.username === "string" ? payload.username : "",
      role: typeof payload.role === "string" ? payload.role : "",
    };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export function cookieName(): string {
  return COOKIE_NAME;
}

const attempts = new Map<string, { count: number; until: number }>();

export function loginAllowed(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec) return true;
  if (now > rec.until) {
    attempts.delete(ip);
    return true;
  }
  return rec.count < 5;
}

export function registerFailedLogin(ip: string): void {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.until) {
    attempts.set(ip, { count: 1, until: now + 10 * 60 * 1000 });
    return;
  }
  rec.count += 1;
}

export function clearLoginAttempts(ip: string): void {
  attempts.delete(ip);
}
