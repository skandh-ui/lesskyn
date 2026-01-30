import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/database/db";
import { adminToggleExpertActive } from "@/controllers/admin.controller";

export async function PATCH(
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
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be a boolean" },
        { status: 400 },
      );
    }

    const expert = await adminToggleExpertActive(id, isActive);

    return NextResponse.json(
      {
        success: true,
        message: `Expert ${isActive ? "activated" : "deactivated"} successfully`,
        expert,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Admin toggle expert error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to toggle expert status" },
      { status: 400 },
    );
  }
}
