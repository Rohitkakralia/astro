import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

// ─── GET /api/profile ─────────────────────────────────────────────────────────
// Returns: user account info + active subscription + saved kundalis count & list
export async function GET(request) {

  // ── Verify JWT ──────────────────────────────────────────────────────────────
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
    // ── 1. User account info ────────────────────────────────────────────────
    const [[user]] = await db.execute(
      `SELECT id, email, created_at
       FROM users
       WHERE id = ?`,
      [userID]
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // ── 2. Latest / active subscription ────────────────────────────────────
    const [[subscription]] = await db.execute(
      `SELECT
         plan_key, plan_name, plan_amount, gst, total,
         currency, payment_status,
         razorpay_order_id, razorpay_payment_id,
         created_at
       FROM subscriptions
       WHERE user_id = ? AND payment_status = 'paid'
       ORDER BY created_at DESC
       LIMIT 1`,
      [userID]
    );

    // ── 3. Saved kundalis ───────────────────────────────────────────────────
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

    // ── 4. Compose response ─────────────────────────────────────────────────
    return NextResponse.json(
      {
        user: {
          id:         user.id,
          email:      user.email,
          memberSince: user.created_at,
        },
        subscription: subscription
          ? {
              planKey:          subscription.plan_key,
              planName:         subscription.plan_name,
              planAmount:       subscription.plan_amount,
              gst:              subscription.gst,
              total:            subscription.total,
              currency:         subscription.currency,
              status:           subscription.payment_status,
              razorpayOrderId:  subscription.razorpay_order_id,
              razorpayPaymentId: subscription.razorpay_payment_id,
              purchasedAt:      subscription.created_at,
            }
          : null,
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