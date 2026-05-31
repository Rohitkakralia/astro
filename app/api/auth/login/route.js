import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d"; // token valid for 7 days

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export async function POST(request) {

  const { email, password } = await request.json();
  console.log("backend login:", email, password);
  
  // ── Validate input ────────────────────────────────────────────────────────
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    // ── Find user by email ────────────────────────────────────────────────
    const [rows] = await db.execute(
      "SELECT id, email, password_hash, created_at FROM users WHERE email = ?",
      [email]
    );
    const user = rows[0];

    if (!user) {
      // Use a generic message — don't reveal whether email exists
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ── Verify password ───────────────────────────────────────────────────
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ── Sign JWT ──────────────────────────────────────────────────────────
    const token = jwt.sign(
      { id: user.id, email: user.email },  // payload (public, don't add sensitive data)
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // ── Return token in response body — frontend stores in localStorage ──────
    return NextResponse.json(
      {
        message: "Login successful.",
        token,
        user: {
          id:         user.id,
          email:      user.email,
          created_at: user.created_at,
        },
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}