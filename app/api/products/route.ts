import { NextResponse } from "next/server";
import { getProductsAfterQuiz, QuizProductInput } from "@/controllers/product.controller";
import { auth } from "@/auth";

// Validation constants
const VALID_COMMITMENTS = ["minimal", "moderate", "extensive"];
const VALID_SKIN_TYPES = ["normal", "oily", "dry", "combination", "sensitive"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { commitment, skinType, concern, preference } = body;

    // 🧪 VALIDATION
    if (!commitment || !skinType || !concern || !preference) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!VALID_COMMITMENTS.includes(commitment)) {
      return NextResponse.json(
        { message: `Invalid commitment. Must be one of: ${VALID_COMMITMENTS.join(", ")}` },
        { status: 400 }
      );
    }

    if(!VALID_SKIN_TYPES.includes(skinType.toLowerCase())) {
      return NextResponse.json(
        { message: `Invalid skinType. Must be one of: ${VALID_SKIN_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // 🧠 CORE LOGIC
    const products = await getProductsAfterQuiz({
      commitment,
      skinType,
      concern,
      preference,
    } as QuizProductInput);

    // ✅ SUCCESS
    return NextResponse.json(
      { products },
      { status: 200 }
    );
  } catch (error) {
    console.error("PRODUCT ROUTE ERROR:", error);

    return NextResponse.json(
      { 
        message: "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { 
          error: error instanceof Error ? error.message : "Unknown error" 
        })
      },
      { status: 500 }
    );
  }
}