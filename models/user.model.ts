import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

interface userSkinDetails {
  skinType: "oily" | "dry" | "combination" | "normal" | "sensitive";
  commitment: "minimal" | "moderate" | "extensive";
  preference: "organic" | "budget friendly";
  concerns: string[]; // e.g., ["acne", "wrinkles"]
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  userName: string;
  email: string;
  role: "admin" | "user" | "expert";
  avatar?: string;
  refreshToken?: string;
  password?: string; // Optional for OAuth users
  provider: "credentials" | "google"; // Authentication provider
  providerId?: string; // OAuth provider user ID
  isActive?: boolean;
  lastActivity?: Date;
  createdAt: Date;
  updatedAt: Date;
  skinDetails?: userSkinDetails;
  expertId?: mongoose.Types.ObjectId; // Reference to Expert model
}

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, unique: true, trim: true, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.provider === "credentials";
      },
    },
    provider: {
      type: String,
      required: true,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    providerId: {
      type: String,
      sparse: true, // Allows null/undefined but enforces uniqueness when present
      index: true, // Moved index here instead of separate declaration
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user", "expert"],
    },
    avatar: {
      type: String, // cloudinary url
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    skinDetails: {
      skinType: {
        type: String,
        enum: ["oily", "dry", "combination", "normal", "sensitive"],
      },
      commitment: {
        type: String,
        enum: ["minimal", "moderate", "extensive"],
      },
      preference: {
        type: String,
        enum: ["organic", "budget friendly"],
      },
      concerns: {
        type: [String],
      },
    },
    expertId: {
      type: Schema.Types.ObjectId,
      ref: "Expert",
      // Optional: Add validation to ensure this is only set when role is "expert"
    },
  },
  { timestamps: true },
);

// Optional: Add index for faster expert lookups
userSchema.index({ expertId: 1 });

// Optional: Add validation to ensure expertId is only set for expert role
userSchema.pre("save", function () {
  if (this.role !== "expert" && this.expertId) {
    this.expertId = undefined;
  }

  // Ensure password is only required for credentials provider
  if (this.provider === "credentials" && !this.password) {
    throw new Error("Password is required for credentials authentication");
  }

  // Ensure providerId is set for OAuth providers
  if (this.provider === "google" && !this.providerId) {
    throw new Error("Provider ID is required for Google authentication");
  }
});

//add a method to useSchema class to check password, here async is used as bcrypt takes lot of time
userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// In serverless or dev environments, this prevents making the model again and avoids errors
export const User = models?.User || model<IUser>("User", userSchema);
