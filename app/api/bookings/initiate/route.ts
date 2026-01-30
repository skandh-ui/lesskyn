import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { initiateBooking } from "@/controllers/booking.controller";
import { connectToDatabase } from "@/database/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const body = await req.json();
    await connectToDatabase();

    const { expertId, duration, formData } = body;

    /* ---------- Validation ---------- */

    if (!expertId || !duration || !formData) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await initiateBooking(userId, {
      expertId,
      duration,
      formData,
    });

    return NextResponse.json(
      {
        success: true,
        ...result, // { bookingId, amount }
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("INITIATE BOOKING ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to initiate booking",
      },
      { status: 400 }
    );
  }
}
