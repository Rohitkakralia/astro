import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
// Called after payment verified (Step 3 → Success)
// Payload: email, password, planKey, planName, planAmount,
//          gst, total, currency, paymentStatus,
//          razorpay_order_id, razorpay_payment_id, razorpay_signature

export async function POST(request) {
  let connection;

  try {
    const body = await request.json();
    console.log("signup start ──────────────────────────");

    const {
      email,
      password,

      planKey,
      planName,
      planAmount,

      gst,
      total,

      currency      = "INR",
      paymentStatus = "paid",

      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    console.log("fields:", {
      email, planKey, planAmount, gst, total,
      razorpay_order_id, razorpay_payment_id,
    });

    // ── Validate required fields ─────────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    if (!planKey || !planName || planAmount == null || gst == null || total == null) {
      return NextResponse.json(
        { message: "Plan details are required." },
        { status: 400 }
      );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: "Payment details are required." },
        { status: 400 }
      );
    }

    // ── Resolve kundali count from plan key ──────────────────────────────
    const PLAN_KUNDALIS = {
      starter:    100,
      pro:        500,
      enterprise: 1000,
    };

    const totalKundali = PLAN_KUNDALIS[planKey];

    if (!totalKundali) {
      return NextResponse.json(
        { message: "Invalid plan key." },
        { status: 400 }
      );
    }

    // ── Get DB connection ────────────────────────────────────────────────
    connection = await db.getConnection();

    // ── Start transaction ────────────────────────────────────────────────
    await connection.beginTransaction();

    // ── Guard: email must not already exist ──────────────────────────────
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
      `INSERT INTO users (email, password_hash) VALUES (?, ?)`,
      [email, hashedPassword]
    );

    const userId = userResult.insertId;
    console.log("user created, id:", userId);

    // ── Insert subscription (payment record + kundali balance) ───────────
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

    console.log("subscription record inserted, kundalis:", totalKundali);

    // ── Insert kundali wallet ─────────────────────────────────────────────
    await connection.execute(
      `INSERT INTO kundali_wallet (user_id, remaining_kundalis) VALUES (?, ?)`,
      [userId, totalKundali]
    );

    console.log("kundali wallet created, balance:", totalKundali);

    // ── Commit ───────────────────────────────────────────────────────────
    await connection.commit();

    console.log("signup complete ────────────────────────");

    // ── Success ──────────────────────────────────────────────────────────
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
    console.error("Signup error:", err);

    if (connection) {
      await connection.rollback();
    }

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