import mongoose from "mongoose";
import { Expert } from "@/models/expert.model";
import { Booking } from "@/models/booking.model";
import { User } from "@/models/user.model";

/* ---------- Admin Controllers for Experts ---------- */

const VALID_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function validateTimeRange(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  if ([sh, sm, eh, em].some(Number.isNaN)) {
    throw new Error("Invalid time format, expected HH:mm");
  }

  if (eh < sh || (eh === sh && em <= sm)) {
    throw new Error("endTime must be after startTime");
  }
}

export async function adminCreateExpert(input: any) {
  const {
    name,
    email,
    phone,
    type,
    durations,
    price,
    weeklyAvailability,
    unavailabilities,
    socials,
    avatar,
    degree,
    experienceYears,
    specialization,
    bio,
  } = input;

  if (!name || !type || !email || !phone) {
    throw new Error("name, type, email, and phone are required");
  }

  if (!["dermatologist", "influencer"].includes(type)) {
    throw new Error("Invalid expert type");
  }

  if (!Array.isArray(durations) || durations.length === 0) {
    throw new Error("At least one duration is required");
  }

  if (price < 0) {
    throw new Error("Price must be >= 0");
  }

  if (!Array.isArray(weeklyAvailability) || weeklyAvailability.length === 0) {
    throw new Error("Weekly availability is required");
  }

  for (const slot of weeklyAvailability) {
    if (!VALID_DAYS.includes(slot.day)) {
      throw new Error(`Invalid day: ${slot.day}`);
    }
    validateTimeRange(slot.startTime, slot.endTime);
  }

  // Validate unavailabilities if provided
  if (unavailabilities && Array.isArray(unavailabilities)) {
    for (const unavail of unavailabilities) {
      if (!unavail.startDate || !unavail.endDate) {
        throw new Error("Unavailability must have startDate and endDate");
      }
      const start = new Date(unavail.startDate);
      const end = new Date(unavail.endDate);
      if (end <= start) {
        throw new Error("Unavailability endDate must be after startDate");
      }
    }
  }

  if (type === "dermatologist") {
    if (!degree || experienceYears == null || !specialization) {
      throw new Error(
        "Dermatologist requires degree, experienceYears, specialization",
      );
    }
  }

  if (type === "influencer" && !bio) {
    throw new Error("Influencer bio is required");
  }

  // Check if user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // Check if user already has an expertId
    if (existingUser.expertId) {
      throw new Error(
        "This email is already associated with an expert account",
      );
    }

    // Check if user is not a regular user
    if (existingUser.role !== "user") {
      throw new Error(
        `This email is already registered as ${existingUser.role}`,
      );
    }
  }

  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the expert first
    const expertArray = await Expert.create(
      [
        {
          name,
          type,
          email,
          phone,
          durations,
          price,
          weeklyAvailability,
          unavailabilities: unavailabilities || [],
          socials: socials || {},
          avatar: avatar || undefined,
          degree: type === "dermatologist" ? degree : undefined,
          experienceYears:
            type === "dermatologist" ? experienceYears : undefined,
          specialization: type === "dermatologist" ? specialization : undefined,
          bio: type === "influencer" ? bio : undefined,
          isActive: true,
        },
      ],
      { session },
    );

    const expert = expertArray[0];

    // Create or update user account for the expert
    if (existingUser) {
      // Update existing user to expert role
      existingUser.role = "expert";
      existingUser.expertId = expert._id;
      existingUser.userName = name;
      if (avatar) existingUser.avatar = avatar;

      // If user was registered with Google, keep their provider info
      // Otherwise, set provider to google with a manual providerId
      if (existingUser.provider !== "google") {
        existingUser.provider = "google";
        existingUser.providerId = `manual_${expert._id.toString()}`;
      }

      await existingUser.save({ session });
    } else {
      // Create new user account with expert role
      // Use a manual providerId since we're creating this before OAuth flow
      await User.create(
        [
          {
            userName: name,
            email,
            role: "expert",
            provider: "google",
            providerId: `manual_${expert._id.toString()}`, // Manual provider ID
            expertId: expert._id,
            avatar: avatar || undefined,
            isActive: true,
          },
        ],
        { session },
      );
    }

    // Commit the transaction
    await session.commitTransaction();

    return expert;
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
}

export async function adminUpdateExpert(expertId: string, updates: any) {
  if (!mongoose.isValidObjectId(expertId)) {
    throw new Error("Invalid expertId");
  }

  const expert = await Expert.findById(expertId);
  if (!expert) throw new Error("Expert not found");

  if (updates.weeklyAvailability) {
    for (const slot of updates.weeklyAvailability) {
      if (!VALID_DAYS.includes(slot.day)) {
        throw new Error(`Invalid day: ${slot.day}`);
      }
      validateTimeRange(slot.startTime, slot.endTime);
    }
  }

  Object.assign(expert, updates);
  await expert.save();

  return expert;
}

export async function adminGetExpertById(expertId: string) {
  if (!mongoose.isValidObjectId(expertId)) {
    throw new Error("Invalid expertId");
  }

  const expert = await Expert.findById(expertId).lean();
  if (!expert) throw new Error("Expert not found");

  return expert;
}

export async function adminListExperts({
  page = 1,
  limit = 20,
  type,
  isActive,
  search,
}: {
  page?: number;
  limit?: number;
  type?: "dermatologist" | "influencer";
  isActive?: boolean;
  search?: string;
}) {
  const filter: any = {};
  if (type) filter.type = type;
  if (typeof isActive === "boolean") filter.isActive = isActive;

  // Add search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { specialization: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [experts, total] = await Promise.all([
    Expert.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Expert.countDocuments(filter),
  ]);

  return {
    experts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function adminToggleExpertActive(
  expertId: string,
  isActive: boolean,
) {
  if (!mongoose.isValidObjectId(expertId)) {
    throw new Error("Invalid expertId");
  }

  const expert = await Expert.findByIdAndUpdate(
    expertId,
    { isActive },
    { new: true },
  );

  if (!expert) throw new Error("Expert not found");
  return expert;
}

export async function adminDeleteExpert(expertId: string) {
  if (!mongoose.isValidObjectId(expertId)) {
    throw new Error("Invalid expertId");
  }

  const expert = await Expert.findByIdAndDelete(expertId);
  if (!expert) throw new Error("Expert not found");

  return { deleted: true };
}

//---------------BOOKING CONTROLLERS ---------------//
export async function adminGetBookingById(bookingId: string) {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new Error("Invalid bookingId");
  }

  const booking = await Booking.findById(bookingId)
    .populate({
      path: "user",
      select: "_id name email",
    })
    .populate({
      path: "expert",
      select: "_id name type",
    })
    .lean();

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
}

export async function adminCancelBooking(
  bookingId: string,
  options?: {
    refundAmount?: number;
    reason?: string;
  },
) {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new Error("Invalid bookingId");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  // ❌ Invalid state transitions
  if (booking.status === "cancelled") {
    throw new Error("Booking is already cancelled");
  }

  if (booking.status === "completed") {
    throw new Error("Completed booking cannot be cancelled");
  }

  if (booking.status === "refunded") {
    throw new Error("Booking is already refunded");
  }

  const now = new Date();

  booking.status = "cancelled";
  booking.cancelledBy = "admin";
  booking.cancelledAt = now;

  // Refund logic (admin-controlled)
  if (typeof options?.refundAmount === "number" && options.refundAmount >= 0) {
    if (options.refundAmount > booking.price) {
      throw new Error("Refund amount cannot exceed booking price");
    }

    booking.refundAmount = options.refundAmount;
  }

  // Optional: clear meeting link so it can't be reused
  booking.meetLink = undefined;

  await booking.save();

  return {
    id: booking._id,
    status: booking.status,
    cancelledAt: booking.cancelledAt,
    cancelledBy: booking.cancelledBy,
    refundAmount: booking.refundAmount,
  };
}
