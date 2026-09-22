import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const token = req.cookies.get("dp_admin")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));
  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret || secret.length < 16) throw new Error("bad secret");
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.delete("dp_admin");
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
