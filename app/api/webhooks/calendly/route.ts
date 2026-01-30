export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/models/booking.model";
import { connectToDatabase } from "@/database/db";

export async function POST(req: NextRequest) {
  console.log("🚨 CALENDLY WEBHOOK HIT");

  try {
    await connectToDatabase();

    const body = await req.json();
    console.log("📦 RAW BODY:", JSON.stringify(body, null, 2));

    const { event, payload } = body;

    if (event !== "invitee.created") {
      return NextResponse.json({ status: "ignored_event" });
    }

    // ✅ Invitee data lives directly on payload
    const invitee = payload;
    const eventData = payload?.scheduled_event;

    if (!invitee || !eventData) {
      console.warn("❌ Missing invitee or scheduled_event");
      return NextResponse.json({ status: "missing_payload" });
    }

    /* ---------- Extract booking_id ---------- */

    const qas = invitee.questions_and_answers || [];
    console.log("❓ QUESTIONS:", qas);

    let bookingId: string | null = null;

    for (const qa of qas) {
      if (qa.question === "booking_id") {
        bookingId = qa.answer;
      }
    }

    if (!bookingId) {
      console.warn("❌ booking_id not found");
      return NextResponse.json({ status: "no_booking_id" });
    }

    console.log("✅ booking_id:", bookingId);

    /* ---------- Fetch booking ---------- */

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.warn("❌ Booking not found");
      return NextResponse.json({ status: "booking_not_found" });
    }

    if (booking.status !== "paid") {
      console.warn("❌ Booking not paid:", booking.status);
      return NextResponse.json({ status: "invalid_state" });
    }

    /* ---------- Save scheduling ---------- */

    booking.startTime = new Date(eventData.start_time);
    booking.endTime = new Date(eventData.end_time);
    booking.status = "confirmed";
    booking.calendly = {
      eventUri: eventData.uri,
      inviteeUri: invitee.uri,
      meetingLink: eventData.location?.join_url,
    };

    await booking.save();

    console.log("✅ BOOKING CONFIRMED");

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("🔥 WEBHOOK ERROR:", err);
    return NextResponse.json({ status: "error" });
  }
}
