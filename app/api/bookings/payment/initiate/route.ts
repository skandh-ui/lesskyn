import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { initiatePayment } from "@/controllers/booking.controller";
import { connectToDatabase } from "@/database/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    const { bookingId, date, slot } = body;

    /* ---------- Validation ---------- */

    if (!bookingId || !date || !slot) {
      return NextResponse.json(
        { message: "Missing required fields: bookingId, date, or slot" },
        { status: 400 },
      );
    }

    const result = await initiatePayment({
      bookingId,
      date,
      slot,
    });

    return NextResponse.json(
      {
        success: true,
        ...result, // { bookingId, amount, paymentUrl }
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("INITIATE PAYMENT ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to initiate payment",
      },
      { status: 400 },
    );
  }
}
