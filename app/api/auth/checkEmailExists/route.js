import { NextResponse } from "next/server";
import db from "@/lib/db";

// ─── POST /api/auth/checkEmailExists ─────────────────────────────────────────

export async function POST(request) {

  let connection;

  try {

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    connection = await db.getConnection();

    const [rows] = await connection.execute(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    return NextResponse.json(
      { exists: rows.length > 0 },
      { status: 200 }
    );

  } catch (err) {

    console.error("checkEmailExists error:", err);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );

  } finally {

    if (connection) {
      connection.release();
    }
  }
}