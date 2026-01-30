import mongoose, { Schema, model, models } from "mongoose";

export type PaymentStatus =
  | "created"     // Payment record created, awaiting payment
  | "pending"     // Payment initiated, waiting for confirmation
  | "success"     // Payment successful
  | "failed"      // Payment failed
  | "refunded";   // Payment refunded

export interface IPayment {
  _id: mongoose.Types.ObjectId;

  booking: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;

  amount: number; // INR
  currency: "INR";

  status: PaymentStatus;

  // BulkPe core fields
  bulkpeOrderId: string;           // Your booking ID sent to BulkPe
  bulkpeTransactionId?: string;    // BulkPe's transaction ID (from webhook)
  
  // Payment details (from BulkPe webhook)
  paymentMode?: string;            // UPI, NEFT, IMPS, etc.
  customerVpa?: string;            // Customer's UPI ID
  utr?: string;                    // Bank UTR number (important for reconciliation)
  
  // Bank details
  accountNumber?: string;
  ifsc?: string;
  holderName?: string;
  
  // Charges & fees
  charge?: number;                 // BulkPe transaction fee
  gst?: number;                    // GST on fee
  
  // Status tracking
  statusDescription?: string;      // Human-readable status from BulkPe
  failureReason?: string;          // Why payment failed (if applicable)
  
  // Timestamps
  paidAt?: Date;                   // When payment was confirmed
  
  // Refund info
  refundedAt?: Date;
  refundedBy?: "admin" | "system";
  refundAmount?: number;
  refundReason?: string;
  
  // Debug & audit
  gatewayResponse?: Record<string, unknown>; // Full BulkPe webhook payload
  
  createdAt: Date;
  updatedAt: Date;
}

/* ---------- Schema ---------- */

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // 1 payment per booking
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "pending", "success", "failed", "refunded"],
      default: "created",
      index: true,
    },

    // BulkPe fields
    bulkpeOrderId: {
      type: String,
      required: true,
      index: true,
    },

    bulkpeTransactionId: {
      type: String,
      unique: true, // Prevent duplicate webhook processing
      sparse: true, // Allow multiple nulls for created/pending payments
      index: true,
    },

    // Payment details
    paymentMode: String,
    customerVpa: String,
    utr: {
      type: String,
      index: true, // Important for reconciliation with bank statements
    },

    // Bank details
    accountNumber: String,
    ifsc: String,
    holderName: String,

    // Charges
    charge: {
      type: Number,
      default: 0,
    },

    gst: {
      type: Number,
      default: 0,
    },

    // Status
    statusDescription: String,
    failureReason: String,

    // Timestamps
    paidAt: Date,

    // Refund
    refundedAt: Date,
    refundedBy: {
      type: String,
      enum: ["admin", "system"],
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundReason: String,

    // Audit trail
    gatewayResponse: {
      type: Schema.Types.Mixed, // Store full BulkPe webhook payload
    },
  },
  { timestamps: true }
);

/* ---------- Indexes ---------- */

// Admin dashboards & reports
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ user: 1, status: 1 });

// Reconciliation queries
paymentSchema.index({ utr: 1 }); // Match with bank statements
paymentSchema.index({ paidAt: 1 }); // Payment date range queries

// BulkPe lookups
paymentSchema.index({ bulkpeOrderId: 1 });
paymentSchema.index({ bulkpeTransactionId: 1 }, { unique: true, sparse: true });

/* ---------- Export ---------- */

export const Payment = models?.Payment || model<IPayment>("Payment", paymentSchema);
