import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { listAllActiveExperts } from "@/controllers/expert.controller";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    if (!type) {
      return NextResponse.json(
        { message: "Expert type is required" },
        { status: 400 }
      );
    }

    if (type !== "dermatologist" && type !== "influencer") {
      return NextResponse.json(
        { message: "Invalid expert type" },
        { status: 400 }
      );
    }

    const data = await listAllActiveExperts({
      type,
      page,
      limit,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET EXPERTS ERROR:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
