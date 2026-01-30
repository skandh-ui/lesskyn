import mongoose, { Schema, model, models } from "mongoose";

/* ---------- Types ---------- */

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

interface WeeklyAvailability {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

interface Unavailability {
  startDate: Date;
  endDate: Date;
  reason?: string;
}

export interface IExpert {
  _id: mongoose.Types.ObjectId;

  name: string;
  type: "dermatologist" | "influencer";

  email?: string;
  phone?: string;
  socials?: SocialLinks;

  /* ---------- Booking ---------- */

  durations: number[]; // [15, 30, 60]
  price: number;

  weeklyAvailability: WeeklyAvailability[];

  unavailabilities?: Unavailability[];

  /* ---------- Profile ---------- */

  avatar?: string;
  degree?: string;
  experienceYears?: number;
  specialization?: string;
  bio?: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* ---------- Schema ---------- */

const expertSchema = new Schema<IExpert>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["dermatologist", "influencer"],
      required: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    socials: {
      facebook: String,
      twitter: String,
      instagram: String,
    },

    durations: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr: number[]) => arr.length > 0,
        message: "At least one duration is required",
      },
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ---------- Weekly Availability ---------- */

    weeklyAvailability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },

        startTime: {
          type: String,
          required: true, // "HH:mm"
        },

        endTime: {
          type: String,
          required: true,
        },
      },
    ],

    /* ---------- Temporary Unavailability ---------- */

    unavailabilities: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        reason: { type: String },
      },
    ],

    avatar: {
      type: String,
      trim: true,
    },

    degree: String,
    experienceYears: Number,
    specialization: String,
    bio: String,

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

/* ---------- Indexes ---------- */

expertSchema.index({ type: 1, isActive: 1 });
expertSchema.index({ price: 1 });

export const Expert = models?.Expert || model<IExpert>("Expert", expertSchema);
