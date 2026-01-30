import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/database/db";
import {
  adminCreateExpert,
  adminListExperts,
} from "@/controllers/admin.controller";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type") as
      | "dermatologist"
      | "influencer"
      | null;
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");

    const result = await adminListExperts({
      page,
      limit,
      type: type || undefined,
      isActive:
        isActive === "true" ? true : isActive === "false" ? false : undefined,
      search: search || undefined,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Admin list experts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch experts" },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    const body = await request.json();

    // Create expert using controller
    const expert = await adminCreateExpert(body);

    return NextResponse.json(
      {
        success: true,
        message: "Expert created successfully",
        expert: {
          id: expert._id,
          name: expert.name,
          email: expert.email,
          type: expert.type,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Admin create expert error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create expert" },
      { status: 400 },
    );
  }
}
