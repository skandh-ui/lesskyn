import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/database/db";
import {
  adminGetExpertById,
  adminUpdateExpert,
} from "@/controllers/admin.controller";

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

    const expert = await adminGetExpertById(id);

    return NextResponse.json({ expert }, { status: 200 });
  } catch (error: any) {
    console.error("Admin get expert error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch expert" },
      { status: 400 },
    );
  }
}

export async function PUT(
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

    const expert = await adminUpdateExpert(id, body);

    return NextResponse.json(
      {
        success: true,
        message: "Expert updated successfully",
        expert,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Admin update expert error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update expert" },
      { status: 400 },
    );
  }
}
