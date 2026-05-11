import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

// ─── POST /api/saveKundali ────────────────────────────────────────────────────
export async function POST(request) {

  // ── Verify JWT ────────────────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const token      = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  let userID;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userID = decoded.id;
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired token. Please log in again." },
      { status: 401 }
    );
  }

  // ── Parse request body ────────────────────────────────────────────────────
  const { name, longitude, latitude, dob, tob, utcOffsetMin, gender, city, country } =
    await request.json();

  // ── Validate required fields ──────────────────────────────────────────────
  if (!name || longitude == null || latitude == null || !dob || !gender) {
    return NextResponse.json(
      { message: "name, longitude, latitude, dob and gender are required." },
      { status: 400 }
    );
  }

  // ── Insert into DB ────────────────────────────────────────────────────────
  try {
    const [result] = await db.execute(
      `INSERT INTO saved_kundali
        (name, longitude, latitude, dob, tob, utc_offset_min, gender, city, country, userID)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, longitude, latitude, dob, tob ?? "12:00", utcOffsetMin ?? 330,
       gender, city ?? null, country ?? null, userID]
    );

    return NextResponse.json(
      { message: "Kundali saved successfully.", kundaliId: result.insertId },
      { status: 201 }
    );

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { message: "This kundali profile already exists." },
        { status: 409 }
      );
    }
    console.error("saveKundali DB error:", { code: err.code, sqlMessage: err.sqlMessage });
    return NextResponse.json(
      { message: "Internal server error.", detail: err.sqlMessage },
      { status: 500 }
    );
  }
}

// ─── GET /api/saveKundali ─────────────────────────────────────────────────────
export async function GET(request) {

  // ── Verify JWT ────────────────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const token      = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  let userID;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userID = decoded.id;
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired token. Please log in again." },
      { status: 401 }
    );
  }

  // ── Fetch all kundalis for this user ──────────────────────────────────────
  try {
    const [rows] = await db.execute(
      `SELECT id, name, longitude, latitude, dob, tob, utc_offset_min,
              gender, city, country, description
       FROM saved_kundali
       WHERE userID = ?
       ORDER BY id DESC`,
      [userID]
    );

    return NextResponse.json({ kundalis: rows }, { status: 200 });

  } catch (err) {
    console.error("getKundali error:", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}


// ─── DELETE /api/saveKundali?id=123 ──────────────────────────────────────────
export async function DELETE(request) {
 
  // ── Verify JWT ────────────────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const token      = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
 
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }
 
  let userID;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userID = decoded.id;
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired token. Please log in again." },
      { status: 401 }
    );
  }
 
  // ── Get kundali id from query param ──────────────────────────────────────
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
 
  if (!id) {
    return NextResponse.json(
      { message: "Kundali id is required." },
      { status: 400 }
    );
  }
 
  try {
    // Only delete if it belongs to this user — prevents deleting others' data
    const [result] = await db.execute(
      "DELETE FROM saved_kundali WHERE id = ? AND userID = ?",
      [id, userID]
    );
 
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Kundali not found or not yours." },
        { status: 404 }
      );
    }
 
    return NextResponse.json(
      { message: "Kundali deleted successfully." },
      { status: 200 }
    );
 
  } catch (err) {
    console.error("deleteKundali error:", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}