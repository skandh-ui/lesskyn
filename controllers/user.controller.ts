import { User } from "@/models/user.model";
import { connectDB } from "@/database/db";

export async function updateUserSkinDetails(
  userId: string,
  skinDetails: {
    skinType?: string;
    commitment?: string;
    preference?: string;
    concerns?: string[];
  },
) {
  try {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Update skin details
    user.skinDetails = {
      skinType: skinDetails.skinType as any,
      commitment: skinDetails.commitment as any,
      preference: skinDetails.preference as any,
      concerns: skinDetails.concerns || [],
    };

    await user.save();

    return {
      success: true,
      user: {
        id: user._id.toString(),
        skinDetails: user.skinDetails,
      },
    };
  } catch (error: any) {
    console.error("Error updating user skin details:", error);
    throw new Error(error.message || "Failed to update skin details");
  }
}

export async function getUserSkinDetails(userId: string) {
  try {
    await connectDB();

    const user = await User.findById(userId).select("skinDetails");

    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      skinDetails: user.skinDetails || null,
    };
  } catch (error: any) {
    console.error("Error fetching user skin details:", error);
    throw new Error(error.message || "Failed to fetch skin details");
  }
}
