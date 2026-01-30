import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { getExpertById } from "@/controllers/expert.controller";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const expert = await getExpertById(id);

    return NextResponse.json(expert, { status: 200 });
  } catch (error: any) {
    console.error("GET EXPERT BY ID ERROR:", error);

    if (error.message === "Invalid expertId") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (error.message === "Expert not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
