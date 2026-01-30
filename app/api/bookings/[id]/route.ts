import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { Booking } from "@/models/booking.model";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 },
      );
    }

    const booking = await Booking.findById(id)
      .populate("expert", "name type avatar")
      .populate("user", "userName email")
      .lean();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: booking._id,
      status: booking.status,
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: booking.duration,
      price: booking.price,
      paymentId: booking.paymentId,
      paidAt: booking.paidAt,
      meetLink: booking.meetLink,
      payer: booking.payer,
      attachments: booking.attachments,
      expert: booking.expert
        ? {
            id: booking.expert._id,
            name: booking.expert.name,
            type: booking.expert.type,
            avatar: booking.expert.avatar,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
