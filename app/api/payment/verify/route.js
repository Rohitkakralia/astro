import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    // 1. Create expected signature using SECRET KEY
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // 2. Compare signatures
    if (expectedSignature === razorpay_signature) {
      // ✅ PAYMENT IS VALID

      // 👉 Here you should:
      // - activate user plan in DB
      // - mark payment as success
      // - grant subscription

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      // ❌ INVALID PAYMENT
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verify Error:", error);

    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}