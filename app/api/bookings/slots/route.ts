import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlotsForNext14Days } from "@/controllers/booking.controller";
import { connectToDatabase } from "@/database/db";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const expertId = searchParams.get("expertId");
    const durationStr = searchParams.get("duration");

    if (!expertId || !durationStr) {
      return NextResponse.json(
        { error: "expertId and duration are required" },
        { status: 400 }
      );
    }

    const duration = parseInt(durationStr, 10);

    if (isNaN(duration) || duration <= 0) {
      return NextResponse.json(
        { error: "Invalid duration" },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlotsForNext14Days({
      expertId,
      duration,
    });

    return NextResponse.json(slots);
  } catch (error: any) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}
