// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import db from "@/lib/db";

// const JWT_SECRET = process.env.JWT_SECRET;

// // ─── POST /api/updatesubscription ────────────────────────────────────────────
// export async function POST(request) {
//   // ── Verify JWT ────────────────────────────────────────────────────────────
//   const authHeader = request.headers.get("authorization");

//   const token = authHeader?.startsWith("Bearer ")
//     ? authHeader.split(" ")[1]
//     : null;

//   if (!token) {
//     return NextResponse.json(
//       { message: "Unauthorized. Please log in." },
//       { status: 401 }
//     );
//   }

//   let userID;

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     userID = decoded.id;
//   } catch {
//     return NextResponse.json(
//       { message: "Invalid or expired token." },
//       { status: 401 }
//     );
//   }

//   try {
//     // ── Get latest paid subscription ───────────────────────────────────────
//     const [[subscription]] = await db.execute(
//       `SELECT id, remaining_kundalis
//        FROM subscriptions
//        WHERE user_id = ?
//          AND payment_status = 'paid'
//        ORDER BY created_at DESC
//        LIMIT 1`,
//       [userID]
//     );

//     if (!subscription) {
//       return NextResponse.json(
//         { message: "No active subscription found." },
//         { status: 404 }
//       );
//     }

//     // ── Check remaining kundalis ───────────────────────────────────────────
//     if (subscription.remaining_kundalis <= 0) {
//       return NextResponse.json(
//         { message: "No remaining kundalis left." },
//         { status: 400 }
//       );
//     }

//     // ── Decrease remaining_kundalis by 1 ───────────────────────────────────
//     await db.execute(
//       `UPDATE subscriptions
//        SET remaining_kundalis = remaining_kundalis - 1
//        WHERE id = ?`,
//       [subscription.id]
//     );

//     // ── Fetch updated value ────────────────────────────────────────────────
//     const [[updatedSubscription]] = await db.execute(
//       `SELECT remaining_kundalis
//        FROM subscriptions
//        WHERE id = ?`,
//       [subscription.id]
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Subscription updated successfully.",
//         remaining_kundalis:
//           updatedSubscription.remaining_kundalis,
//       },
//       { status: 200 }
//     );

//   } catch (err) {
//     console.error("updatesubscription POST error:", err);

//     return NextResponse.json(
//       {
//         message: "Internal server error.",
//         detail: err.sqlMessage,
//       },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

// ─── POST /api/updatesubscription ────────────────────────────────────────────
export async function POST(request) {
  // ── Verify JWT ─────────────────────────────────────────────────────────────
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
      { message: "Invalid or expired token." },
      { status: 401 }
    );
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // ── Check kundali_wallet ───────────────────────────────────────────────
    const [[wallet]] = await connection.execute(
      `SELECT id, remaining_kundalis
       FROM kundali_wallet
       WHERE user_id = ?`,
      [userID]
    );

    if (!wallet) {
      await connection.rollback();
      return NextResponse.json(
        { message: "No kundali wallet found." },
        { status: 404 }
      );
    }

    if (wallet.remaining_kundalis <= 0) {
      await connection.rollback();
      return NextResponse.json(
        { message: "No remaining kundalis left." },
        { status: 400 }
      );
    }

    // ── Deduct from kundali_wallet (sole source of truth) ─────────────────
    await connection.execute(
      `UPDATE kundali_wallet
       SET remaining_kundalis = remaining_kundalis - 1
       WHERE user_id = ?`,
      [userID]
    );

    await connection.commit();

    // ── Return updated balance ─────────────────────────────────────────────
    const [[updatedWallet]] = await connection.execute(
      `SELECT remaining_kundalis
       FROM kundali_wallet
       WHERE user_id = ?`,
      [userID]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Kundali deducted successfully.",
        remaining_kundalis: updatedWallet.remaining_kundalis,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("updatesubscription POST error:", err);
    if (connection) await connection.rollback();
    return NextResponse.json(
      { message: "Internal server error.", detail: err.sqlMessage },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}