import { NextResponse } from "next/server";
import { createBookingFromPayment } from "@/controllers/booking.controller";
import { createGoogleMeetEvent } from "@/lib/createGoogleMeetEvent";
import { Booking } from "@/models/booking.model";
import { connectToDatabase } from "@/database/db";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    console.log("[BulkPe Webhook] Received:", JSON.stringify(payload, null, 2));

    const { statusCode, data } = payload;

    if (!data || statusCode !== 200) {
      console.error("[BulkPe Webhook] Invalid payload structure");
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const {
      order_id,
      reference_id,
      transcation_id,
      transaction_id,
      status,
      amount,
      utr,
      payment_mode,
      statusDescription,
    } = data;

    const bookingId = order_id || reference_id;
    const paymentId = transcation_id || transaction_id;

    if (!bookingId || !paymentId || !status || amount == null) {
      console.error("[BulkPe Webhook] Invalid data - missing required fields");
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (status !== "SUCCESS") {
      console.log(
        `[BulkPe Webhook] Payment ${status} for booking ${bookingId}`,
        `Reason: ${statusDescription || "N/A"}`,
      );
      return NextResponse.json({ success: true }, { status: 200 });
    }

    try {
      await connectToDatabase();

      const booking = await createBookingFromPayment({
        bookingId,
        amount: parseFloat(amount.toString()),
        paymentId,
      });

      if (booking.startTime && booking.endTime) {
        try {
          const populatedBooking = await Booking.findById(booking._id)
            .populate("expert", "name email")
            .populate("user", "email")
            .lean();

          if (populatedBooking) {
            const { meetLink } = await createGoogleMeetEvent({
              title: `Consultation with ${populatedBooking.expert.name}`,
              description: `Skin consultation session\nDuration: ${booking.duration} minutes\nAmount: ₹${booking.price}`,
              startTimeUTC: booking.startTime,
              endTimeUTC: booking.endTime,
              attendees: [
                { email: populatedBooking.expert.email },
                { email: populatedBooking.user.email },
                { email: booking.payer.email },
              ],
              attachments: booking.attachments,
            });

            booking.meetLink = meetLink;
            booking.meetCreatedAt = new Date();
            booking.status = "confirmed";
            await booking.save();

            console.log(`[BulkPe Webhook] ✓ Google Meet created: ${meetLink}`);
          }
        } catch (meetError: any) {
          console.error(
            "[BulkPe Webhook] Failed to create Google Meet:",
            meetError.message,
          );
        }
      }

      console.log(
        `[BulkPe Webhook] ✓ Booking ${booking._id} confirmed`,
        `Amount: ₹${amount}, UTR: ${utr}, Mode: ${payment_mode}`,
      );

      return NextResponse.json(
        {
          success: true,
          message: "Booking confirmed",
        },
        { status: 200 },
      );
    } catch (err: any) {
      console.error(
        `[BulkPe Webhook] ✗ Error processing booking ${bookingId}:`,
        err.message,
      );

      return NextResponse.json(
        {
          success: true,
          message:
            "Payment received, booking processing failed - manual review required",
        },
        { status: 200 },
      );
    }
  } catch (err) {
    console.error("[BulkPe Webhook] Fatal error:", err);

    return NextResponse.json(
      {
        success: true,
        message: "Webhook received",
      },
      { status: 200 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "BulkPe webhook endpoint",
  });
}
