import { NextResponse } from "next/server";

// ─── GET /api/payment/invoice?paymentId=pay_xxxxx ─────────────────────────────
// No JWT required — paymentId is unguessable (Razorpay format)
export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("paymentId");

  if (!paymentId) {
    return NextResponse.json(
      { message: "paymentId is required." },
      { status: 400 }
    );
  }

  try {
    const credentials = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const paymentRes = await fetch(
      `https://api.razorpay.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Basic ${credentials}` } }
    );
    const payment = await paymentRes.json();

    if (payment.error) {
      return NextResponse.json(
        { message: payment.error.description || "Payment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id:          payment.id,
      amount:      payment.amount / 100,
      currency:    payment.currency,
      status:      payment.status,
      method:      payment.method,
      email:       payment.email,
      contact:     payment.contact,
      description: payment.description,
      orderId:     payment.order_id,
      createdAt:   payment.created_at,
      vpa:         payment.vpa,
      bank:        payment.bank,
      wallet:      payment.wallet,
      card:        payment.card ? {
        network: payment.card.network,
        last4:   payment.card.last4,
        issuer:  payment.card.issuer,
      } : null,
    });

  } catch (err) {
    console.error("invoice fetch error:", err);
    return NextResponse.json(
      { message: "Failed to fetch payment details." },
      { status: 500 }
    );
  }
}