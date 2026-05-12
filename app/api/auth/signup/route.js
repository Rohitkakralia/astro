import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

// ─── POST /api/registerUser ───────────────────────────────────────────────

export async function POST(request) {

  let connection;

  try {

    const body = await request.json();
    console.log("user register start------");
    const {
      email,
      password,

      planKey,
      planName,
      planAmount,

      gst,
      total,

      currency,
      paymentStatus,

      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    console.log("fields:", email, password, planKey, planAmount, gst, total, razorpay_order_id, razorpay_payment_id, razorpay_signature);

    // ── Validate input ───────────────────────────────────────────────────

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // ── Get DB connection ────────────────────────────────────────────────

    connection = await db.getConnection();

    // ── Start transaction ────────────────────────────────────────────────

    await connection.beginTransaction();

    // ── Check existing user ──────────────────────────────────────────────

    const [existingUsers] = await connection.execute(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (existingUsers.length > 0) {

      await connection.rollback();

      return NextResponse.json(
        { message: "Email already exists." },
        { status: 400 }
      );
    }

    // ── Hash password ────────────────────────────────────────────────────

    const hashedPassword = await bcrypt.hash(password, 10);

    // ── Insert user ──────────────────────────────────────────────────────

    const [userResult] = await connection.execute(
      `
      INSERT INTO users (
        email,
        password_hash
      )
      VALUES (?, ?)
      `,
      [
        email,
        hashedPassword,
      ]
    );

    const userId = userResult.insertId;

    // ── Insert subscription/payment ─────────────────────────────────────

    await connection.execute(
      `
      INSERT INTO subscriptions (
        user_id,
        plan_key,
        plan_name,
        plan_amount,
        gst,
        total,
        currency,
        payment_status,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        planKey,
        planName,
        planAmount,
        gst,
        total,
        currency,
        paymentStatus,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      ]
    );

    // ── Commit transaction ───────────────────────────────────────────────

    await connection.commit();

    // ── Return success response ──────────────────────────────────────────

    return NextResponse.json(
      {
        message: "User registered successfully.",

        user: {
          id: userId,
          email,
        },
      },
      { status: 201 }
    );

  } catch (err) {

    console.error("Register error:", err);

    // rollback if error
    if (connection) {
      await connection.rollback();
    }

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );

  } finally {

    // release DB connection
    if (connection) {
      connection.release();
    }
  }
}