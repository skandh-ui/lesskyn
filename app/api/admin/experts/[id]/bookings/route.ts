import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/database/db";
import { Booking } from "@/models/booking.model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    await connectToDatabase();
    const { id } = await params;

    const bookings = await Booking.find({ expert: id })
      .populate("user", "userName email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error("Admin get expert bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 400 },
    );
  }
}
