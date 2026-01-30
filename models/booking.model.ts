import mongoose, { Schema, model, models } from "mongoose";

/* ---------- Types ---------- */

export type BookingStatus =
  | "payment_pending"
  | "paid"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "refunded";

export interface IBooking {
  _id: mongoose.Types.ObjectId;

  user: mongoose.Types.ObjectId;
  expert: mongoose.Types.ObjectId;

  // Slot (stored in UTC)
  startTime?: Date;
  endTime?: Date;
  slotTimezone: "Asia/Kolkata";

  duration: number; // minutes
  price: number;

  status: BookingStatus;
  payer: {
    name: string;
    email: string;
    phone: string;
  };

  // Payment (Bulkpe)
  paymentId?: string;
  paidAt?: Date;

  // Meeting (Google Meet)
  meetLink?: string;
  meetCreatedAt?: Date;

  // Attachments (Cloudinary URLs)
  attachments?: {
    url: string;
    title?: string;
    mimeType?: string;
  }[];

  // Cancellation / Refund
  cancelledBy?: "user" | "admin";
  cancelledAt?: Date;
  refundAmount?: number;

  // ✅ TTL for payment_pending bookings
  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

/* ---------- Schema ---------- */

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    expert: {
      type: Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
      index: true,
    },

    startTime: {
      type: Date,
      index: true,
    },

    endTime: {
      type: Date,
    },

    slotTimezone: {
      type: String,
      enum: ["Asia/Kolkata"],
      default: "Asia/Kolkata",
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "payment_pending",
        "paid",
        "confirmed",
        "completed",
        "cancelled",
        "refunded",
      ],
      default: "payment_pending",
      index: true,
    },

    payer: {
      name: String,
      email: String,
      phone: String,
    },

    // Bulkpe
    paymentId: String,
    paidAt: Date,

    // Google Meet
    meetLink: String,
    meetCreatedAt: Date,

    // Attachments (Cloudinary URLs)
    attachments: [
      {
        url: { type: String, required: true },
        title: String,
        mimeType: String,
      },
    ],

    cancelledBy: {
      type: String,
      enum: ["user", "admin"],
    },

    cancelledAt: Date,

    refundAmount: {
      type: Number,
      min: 0,
    },

    // ✅ TTL field - MongoDB will auto-delete when this date is reached
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

/* ---------- Indexes ---------- */

// Dashboards
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ expert: 1, status: 1 });

// Prevent double booking at DB level (final safety net)
// Only enforce uniqueness when startTime and endTime are set (not null)
bookingSchema.index(
  { expert: 1, startTime: 1, endTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      startTime: { $exists: true, $type: "date" },
      endTime: { $exists: true, $type: "date" },
    },
  },
);

// ✅ TTL Index - Only applies to payment_pending bookings
// This ensures only unpaid bookings expire, not paid ones
bookingSchema.index(
  { expiresAt: 1 },
  {
    expires: 0,
    partialFilterExpression: { status: "payment_pending" },
  },
);

export const Booking =
  models?.Booking || model<IBooking>("Booking", bookingSchema);
