import { NextResponse } from "next/server";
import { createBookingFromPayment } from "@/controllers/booking.controller";
import { createGoogleMeetEvent } from "@/lib/createGoogleMeetEvent";
import { Booking } from "@/models/booking.model";
import { connectToDatabase } from "@/database/db";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("[PayU Webhook] Received:", JSON.stringify(payload, null, 2));

    // PayU REST Webhook structure usually includes 'result' object
    const data = payload.result || payload;

    const { status, txnid, amount, payuId } = data;

    if (!txnid || !status) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (status.toLowerCase() !== "success") {
      console.log(`[PayU Webhook] Payment failed for booking ${txnid}`);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    try {
      await connectToDatabase();

      // Process Booking
      const booking = await createBookingFromPayment({
        bookingId: txnid,
        amount: parseFloat(amount.toString()),
        paymentId: payuId || txnid,
      });

      // (Keep your exact Google Meet Creation Logic here)
      // ... same as BulkPe's google meet logic

      return NextResponse.json({ success: true, message: "Confirmed" }, { status: 200 });

    } catch (err: any) {
      console.error(`[PayU Webhook] Error:`, err.message);
      return NextResponse.json({ success: true }, { status: 200 });
    }
  } catch (err) {
    console.error("[PayU Webhook] Fatal error:", err);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "PayU webhook endpoint" });
}