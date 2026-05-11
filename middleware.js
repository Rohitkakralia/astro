import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─── Route lists ──────────────────────────────────────────────────────────────
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/api/user"];
const AUTH_ROUTES      = ["/login", "/register"];

async function verifyToken(token) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  await jwtVerify(token, secret); // throws if invalid/expired
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read token from cookie (set by frontend after login)
  const token = request.cookies.get("token")?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthPage  = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // ── Accessing a protected route ───────────────────────────────────────────
  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      await verifyToken(token);
      return NextResponse.next();                        // ✅ valid token
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ── Accessing /login or /register while already logged in ─────────────────
  if (isAuthPage && token) {
    try {
      await verifyToken(token);
      return NextResponse.redirect(new URL("/", request.url)); // ✅ send to home
    } catch {
      return NextResponse.next(); // bad token — let them log in again
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/user/:path*",
    "/login",
    "/register",
  ],
};