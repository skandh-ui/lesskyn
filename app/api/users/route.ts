import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/database/db"; // your mongo connection util
import { User } from "@/models/user.model";

//get user profile info
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      email: session.user.email,
    }).select("-password -refreshToken");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("GET USER ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


//update user profile info
export async function PATCH(req: Request) {
  try {
    // 🔐 AUTH
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📦 BODY
    const body = await req.json();
    const { userName, avatar, skinDetails } = body;

    // 🚫 Nothing to update
    if (!userName && !avatar && !skinDetails) {
      return NextResponse.json(
        { message: "No fields provided for update" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 🧠 Build update object safely
    const updateData: any = {};

    if (userName) {
      updateData.userName = userName.trim();
    }

    if (avatar) {
      updateData.avatar = avatar;
    }

    if (skinDetails) {
      updateData.skinDetails = {};

      if (skinDetails.skinType) {
        updateData.skinDetails.skinType = skinDetails.skinType;
      }

      if (skinDetails.commitment) {
        updateData.skinDetails.commitment = skinDetails.commitment;
      }

      if (skinDetails.preference) {
        updateData.skinDetails.preference = skinDetails.preference;
      }

      if (Array.isArray(skinDetails.concerns)) {
        updateData.skinDetails.concerns = skinDetails.concerns;
      }
    }

    // 🧪 Prevent empty nested object
    if (
      updateData.skinDetails &&
      Object.keys(updateData.skinDetails).length === 0
    ) {
      delete updateData.skinDetails;
    }

    // 📝 UPDATE
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (error) {
    console.error("USER UPDATE ERROR:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
