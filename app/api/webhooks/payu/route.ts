import { NextResponse } from "next/server";
import crypto from "crypto";
import { createBookingFromPayment } from "@/controllers/booking.controller";
import { createGoogleMeetEvent } from "@/lib/createGoogleMeetEvent";
import { Booking } from "@/models/booking.model";
import { connectToDatabase } from "@/database/db";

function verifyPayuHash(params: Record<string, string>): boolean {
  const { key, txnid, amount, productinfo, firstname, email, status, hash } =
    params;

  // Reverse hash: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const hashString = `${process.env.PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const computed = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  return computed === hash;
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params: Record<string, string> = {};
    for (const [k, v] of new URLSearchParams(text)) {
      params[k] = v;
    }

    console.log("[PayU Webhook] Received:", JSON.stringify(params, null, 2));

    if (!verifyPayuHash(params)) {
      console.error("[PayU Webhook] Hash verification failed");
      return NextResponse.json({ success: false }, { status: 200 });
    }

    const { status, txnid, mihpayid, amount } = params;

    if (status !== "success") {
      console.log(`[PayU Webhook] Payment ${status} for txnid ${txnid}`);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!txnid || !mihpayid || !amount) {
      console.error("[PayU Webhook] Missing required fields");
      return NextResponse.json({ success: true }, { status: 200 });
    }

    try {
      await connectToDatabase();

      const booking = await createBookingFromPayment({
        bookingId: txnid,
        amount: parseFloat(amount),
        paymentId: mihpayid,
      });

      if (booking.startTime && booking.endTime) {
        try {
          const populatedBooking = await Booking.findById(booking._id)
            .populate("expert", "name email")
            .populate("user", "email")
            .lean();

          if (populatedBooking) {
            let description = `Skin consultation session\nDuration: ${booking.duration} minutes\nAmount: ₹${booking.price}`;

            description += `\n\n--- Patient Skin Details ---`;

            if (booking.skinType) {
              description += `\nSkin Type: ${booking.skinType}`;
            }

            if (booking.concerns && booking.concerns.length > 0) {
              description += `\nConcerns: ${booking.concerns.join(", ")}`;
            }

            if (booking.description) {
              description += `\nAdditional Details: ${booking.description}`;
            }

            if (booking.attachments && booking.attachments.length > 0) {
              description += `\n\nAttachments: ${booking.attachments.length} file(s)`;
              booking.attachments.forEach((att, index) => {
                description += `\n${index + 1}. ${att.title || "Attachment"}: ${att.url}`;
              });
            }

            const { meetLink } = await createGoogleMeetEvent({
              title: `Consultation with ${populatedBooking.expert.name}`,
              description,
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

            console.log(`[PayU Webhook] Google Meet created: ${meetLink}`);
          }
        } catch (meetError: any) {
          console.error(
            "[PayU Webhook] Failed to create Google Meet:",
            meetError.message,
          );
        }
      }

      console.log(
        `[PayU Webhook] Booking ${booking._id} confirmed. Amount: ₹${amount}, PayU ID: ${mihpayid}`,
      );

      return NextResponse.json(
        { success: true, message: "Booking confirmed" },
        { status: 200 },
      );
    } catch (err: any) {
      console.error(
        `[PayU Webhook] Error processing booking ${txnid}:`,
        err.message,
      );

      return NextResponse.json(
        {
          success: true,
          message: "Payment received, booking processing failed - manual review required",
        },
        { status: 200 },
      );
    }
  } catch (err) {
    console.error("[PayU Webhook] Fatal error:", err);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "PayU webhook endpoint" });
}
