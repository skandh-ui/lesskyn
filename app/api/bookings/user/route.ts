import { NextRequest, NextResponse } from "next/server";
import { listUserBookings } from "@/controllers/booking.controller";
import { connectToDatabase } from "@/database/db";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const bookings = await listUserBookings({
      userId,
      status: status || undefined,
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}
