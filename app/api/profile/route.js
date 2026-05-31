import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

// ─── GET /api/profile ─────────────────────────────────────────────────────────
export async function GET(request) {

  // ── Verify JWT ────────────────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
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

  try {
    // ── 1. User account info ──────────────────────────────────────────────
    const [[user]] = await db.execute(
      `SELECT id, email, created_at FROM users WHERE id = ?`,
      [userID]
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // ── 2. Kundali wallet (source of truth for balance) ───────────────────
    const [[wallet]] = await db.execute(
      `SELECT remaining_kundalis FROM kundali_wallet WHERE user_id = ?`,
      [userID]
    );

    // ── 3. ALL subscriptions (full payment history) ───────────────────────
    const [subscriptions] = await db.execute(
      `SELECT
         plan_key, plan_name, plan_amount, gst, total,
         currency, payment_status,
         razorpay_order_id, razorpay_payment_id,
         created_at
       FROM subscriptions
       WHERE user_id = ? AND payment_status = 'paid'
       ORDER BY created_at DESC`,
      [userID]
    );

    // ── 4. Saved kundalis ─────────────────────────────────────────────────
    const [kundalis] = await db.execute(
      `SELECT
         id, name, gender, dob, tob,
         city, country, description,
         longitude, latitude, utc_offset_min
       FROM saved_kundali
       WHERE userID = ?
       ORDER BY id DESC`,
      [userID]
    );

    // ── 5. Compose response ───────────────────────────────────────────────
    return NextResponse.json(
      {
        user: {
          id:          user.id,
          email:       user.email,
          memberSince: user.created_at,
        },

        // live balance from wallet
        remainingKundalis: wallet?.remaining_kundalis ?? 0,

        // latest plan (for the badge/header)
        activeSubscription: subscriptions[0]
          ? {
              planKey:           subscriptions[0].plan_key,
              planName:          subscriptions[0].plan_name,
              planAmount:        subscriptions[0].plan_amount,
              gst:               subscriptions[0].gst,
              total:             subscriptions[0].total,
              currency:          subscriptions[0].currency,
              status:            subscriptions[0].payment_status,
              razorpayOrderId:   subscriptions[0].razorpay_order_id,
              razorpayPaymentId: subscriptions[0].razorpay_payment_id,
              purchasedAt:       subscriptions[0].created_at,
            }
          : null,

        // full history
        subscriptionHistory: subscriptions.map((s) => ({
          planKey:           s.plan_key,
          planName:          s.plan_name,
          planAmount:        s.plan_amount,
          gst:               s.gst,
          total:             s.total,
          currency:          s.currency,
          status:            s.payment_status,
          razorpayOrderId:   s.razorpay_order_id,
          razorpayPaymentId: s.razorpay_payment_id,
          purchasedAt:       s.created_at,
        })),

        kundalis: kundalis.map((k) => ({
          id:           k.id,
          name:         k.name,
          gender:       k.gender,
          dob:          k.dob,
          tob:          k.tob,
          city:         k.city,
          country:      k.country,
          description:  k.description,
          longitude:    k.longitude,
          latitude:     k.latitude,
          utcOffsetMin: k.utc_offset_min,
        })),
        kundaliCount: kundalis.length,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("profile GET error:", err);
    return NextResponse.json(
      { message: "Internal server error.", detail: err.sqlMessage },
      { status: 500 }
    );
  }
}