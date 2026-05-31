import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

// ─── POST /api/auth/updatePlan ────────────────────────────────────────────────
// Verifies user login, records payment in subscriptions,
// and credits kundalis to kundali_wallet

export async function POST(request) {
  let connection;

  try {
    const body = await request.json();

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

    // ── Validate ─────────────────────────────────────────────────────────────
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

    // ── Resolve kundali count ─────────────────────────────────────────────────
    const PLAN_KUNDALIS = {
      starter:    100,
      pro:        500,
      enterprise: 1000,
    };

    const addKundalis = PLAN_KUNDALIS[planKey];

    if (!addKundalis) {
      return NextResponse.json(
        { message: "Invalid plan key." },
        { status: 400 }
      );
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // ── Find user ─────────────────────────────────────────────────────────────
    const [[user]] = await connection.execute(
      `SELECT id, password_hash FROM users WHERE email = ?`,
      [email]
    );

    if (!user) {
      await connection.rollback();
      return NextResponse.json(
        { message: "No account found with this email." },
        { status: 404 }
      );
    }

    // ── Verify password ───────────────────────────────────────────────────────
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      await connection.rollback();
      return NextResponse.json(
        { message: "Incorrect password." },
        { status: 401 }
      );
    }

    // ── Insert new subscription (payment record) ──────────────────────────────
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
        user.id,
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

    console.log("subscription record inserted for user:", user.id);

    // ── Credit kundalis to wallet ─────────────────────────────────────────────
    const [[wallet]] = await connection.execute(
      `SELECT id FROM kundali_wallet WHERE user_id = ?`,
      [user.id]
    );

    if (wallet) {
      // wallet exists → increment
      await connection.execute(
        `UPDATE kundali_wallet
         SET remaining_kundalis = remaining_kundalis + ?
         WHERE user_id = ?`,
        [addKundalis, user.id]
      );
    } else {
      // no wallet yet → create
      await connection.execute(
        `INSERT INTO kundali_wallet (user_id, remaining_kundalis)
         VALUES (?, ?)`,
        [user.id, addKundalis]
      );
    }

    console.log("kundali_wallet credited:", addKundalis, "for user:", user.id);

    await connection.commit();

    // ── Issue new JWT ─────────────────────────────────────────────────────────
    const token = jwt.sign(
      { id: user.id, email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Plan updated successfully.",
        token,
        user: { id: user.id, email },
        added_kundalis: addKundalis,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("updatePlan error:", err);
    if (connection) await connection.rollback();
    return NextResponse.json(
      { message: "Internal server error.", detail: err.sqlMessage },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}