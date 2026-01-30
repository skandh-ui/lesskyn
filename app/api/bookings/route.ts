import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listUserBookings } from "@/controllers/booking.controller";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const bookings = await listUserBookings({
      userId,
      status,
    });
    return NextResponse.json(
      {
        success: true,
        data: bookings,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("LIST BOOKINGS ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}
