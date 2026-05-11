import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SALT_ROUNDS = 12;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── POST /api/auth ───────────────────────────────────────────────────────────
export async function POST(request) {
  const { email, password } = await request.json();
  console.log("login:", email, password);

  // ── Validate input ──────────────────────────────────────────────────────────
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "Invalid email format." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  try {
    // ── Check if user exists ────────────────────────────────────────────────
    const [rows] = await db.execute(
      "SELECT id, password_hash FROM users WHERE email = ?",
      [email]
    );
    const existing = rows[0];

    // ── Register (new user) ─────────────────────────────────────────────────
    if (!existing) {
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      const [result] = await db.execute(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)",
        [email, password_hash]
      );

      const [newUser] = await db.execute(
        "SELECT id, email, created_at FROM users WHERE id = ?",
        [result.insertId]
      );

      return NextResponse.json(
        { message: "Account created successfully.", user: newUser[0] },
        { status: 201 }
      );
    }

    // ── Login (existing user) ───────────────────────────────────────────────
    const match = await bcrypt.compare(password, existing.password_hash);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const [user] = await db.execute(
      "SELECT id, email, created_at FROM users WHERE id = ?",
      [existing.id]
    );

    return NextResponse.json(
      { message: "Login successful.", user: user[0] },
      { status: 200 }
    );

  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}