import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount, currency = "INR", planKey } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    // 1. Create Razorpay instance (SECRET KEY ONLY HERE)
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 2. Create order
    const order = await instance.orders.create({
      amount: amount, // already in paise
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        planKey: planKey || "unknown",
      },
    });

    // 3. Send order to frontend
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error("Create Order Error:", error);

    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}