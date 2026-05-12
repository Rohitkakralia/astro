import { NextResponse } from "next/server";
import db from "@/lib/db";

// ─── POST /api/auth/check-email ───────────────────────────────────────────────
export async function POST(request) {
  try {
    const { email } = await request.json();

    // Find user by email
    const [rows] = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const user = rows[0];

    return NextResponse.json(
      {
        exists: !!user,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Check email error:", err);

    return NextResponse.json(
      {
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}