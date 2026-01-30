import mongoose, { isValidObjectId } from "mongoose";
import { Booking, BookingStatus } from "@/models/booking.model";
import { Expert } from "@/models/expert.model";
import { createBulkpePayment } from "@/lib/createBulkPePayment";

interface ListBookingsInput {
  userId: string;
  status?: string; // optional filter
}

const IST_TZ = "Asia/Kolkata";
const IST_OFFSET = "+05:30";
const DAYS_TO_SHOW = 14;
const PAYMENT_EXPIRY_MINUTES = 15;

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function getAvailableSlotsForNext14Days(payload: {
  expertId: string;
  duration: number;
}) {
  const { expertId, duration } = payload;

  if (!isValidObjectId(expertId)) {
    throw new Error("Invalid expertId");
  }

  const expert = await Expert.findById(expertId);

  if (!expert || !expert.isActive) {
    throw new Error("Expert not available");
  }

  if (!expert.durations.includes(duration)) {
    throw new Error("Invalid duration");
  }

  const todayIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: IST_TZ }),
  );

  const startOfTodayIST = new Date(
    `${todayIST.toISOString().slice(0, 10)}T00:00:00${IST_OFFSET}`,
  );

  const endDateIST = new Date(startOfTodayIST);
  endDateIST.setDate(endDateIST.getDate() + DAYS_TO_SHOW);

  /* ---------- Fetch existing bookings ---------- */
  // ✅ Include payment_pending bookings with assigned slots
  const existingBookings = await Booking.find({
    expert: expertId,
    $or: [
      { status: { $in: ["paid", "confirmed"] } },
      {
        status: "payment_pending",
        startTime: { $exists: true }, // Only payment_pending with slots assigned
      },
    ],
    startTime: {
      $gte: startOfTodayIST,
      $lt: endDateIST,
    },
  }).select("startTime endTime");

  const result: Record<string, string[]> = {};

  /* ---------- Iterate day-by-day ---------- */

  for (let i = 0; i < DAYS_TO_SHOW; i++) {
    const dateIST = new Date(startOfTodayIST);
    dateIST.setDate(dateIST.getDate() + i);

    // Format date as YYYY-MM-DD in IST timezone
    const year = dateIST.getFullYear();
    const month = String(dateIST.getMonth() + 1).padStart(2, "0");
    const day = String(dateIST.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const dayName = dateIST.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: IST_TZ,
    });

    const availability = expert.weeklyAvailability.find(
      (d) => d.day === dayName,
    );

    if (!availability) continue;

    /* ---------- Check unavailability ---------- */

    if (
      expert.unavailabilities?.some(
        (u) =>
          dateIST >= new Date(u.startDate) && dateIST <= new Date(u.endDate),
      )
    ) {
      continue;
    }

    const startMinutes = toMinutes(availability.startTime);
    const endMinutes = toMinutes(availability.endTime);

    const slots: string[] = [];

    for (
      let current = startMinutes;
      current + duration <= endMinutes;
      current += duration
    ) {
      const startTimeStr = minutesToTime(current);
      const endTimeStr = minutesToTime(current + duration);
      const startUTC = new Date(`${dateStr}T${startTimeStr}:00${IST_OFFSET}`);
      const endUTC = new Date(`${dateStr}T${endTimeStr}:00${IST_OFFSET}`);

      // Skip past slots
      if (startUTC < new Date()) continue;

      const overlaps = existingBookings.some(
        (b) => startUTC < b.endTime && endUTC > b.startTime,
      );

      if (!overlaps) {
        slots.push(`${startTimeStr}-${endTimeStr}`);
      }
    }

    if (slots.length) {
      result[dateStr] = slots;
    }
  }

  return result;
}

export async function initiateBooking(
  userId: string,
  payload: {
    expertId: string;
    duration: number;
    formData: {
      name: string;
      email: string;
      phone: string;
      skinType: string;
      concerns: string[];
      description?: string;
      attachments?: {
        url: string;
        title?: string;
        mimeType?: string;
      }[];
    };
  },
) {
  const { expertId, duration, formData } = payload;

  /* ---------- Basic validation ---------- */

  if (!isValidObjectId(userId) || !isValidObjectId(expertId)) {
    throw new Error("Invalid userId or expertId");
  }

  if (formData.attachments && formData.attachments.length > 5) {
    throw new Error("Maximum 5 attachments allowed");
  }

  // Validate attachment URLs
  if (formData.attachments) {
    for (const att of formData.attachments) {
      if (!att.url || typeof att.url !== "string") {
        throw new Error("Invalid attachment URL");
      }
    }
  }

  const expert = await Expert.findById(expertId);

  if (!expert || !expert.isActive) {
    throw new Error("Expert not available");
  }

  if (!expert.durations.includes(duration)) {
    throw new Error("Invalid duration selected");
  }

  /* ---------- Set expiry time ---------- */
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + PAYMENT_EXPIRY_MINUTES);

  /* ---------- Create draft booking ---------- */
  const booking = await Booking.create({
    user: userId,
    expert: expertId,
    duration,
    price: expert.price,
    status: "payment_pending",
    payer: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    },
    skinType: formData.skinType,
    concerns: formData.concerns,
    description: formData.description,
    attachments: formData.attachments,
    expiresAt, // ✅ Auto-delete after 15 minutes if not paid
  });

  return {
    bookingId: booking._id,
    amount: expert.price,
    expiresAt, // ✅ Return expiry time to frontend
  };
}

//called from bulkpe webhook
export async function createBookingFromPayment(payload: {
  bookingId: string;
  amount: number;
  paymentId: string;
}) {
  const { bookingId, amount, paymentId } = payload;

  if (!isValidObjectId(bookingId)) {
    throw new Error("Invalid bookingId");
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  /* ---------- Idempotency check ---------- */

  if (booking.status === "paid" || booking.status === "confirmed") {
    return booking;
  }

  if (booking.status !== "payment_pending") {
    throw new Error(`Invalid booking state: ${booking.status}`);
  }

  /* ---------- Validate amount ---------- */

  if (booking.price !== amount) {
    throw new Error("Payment amount mismatch");
  }

  /* ---------- Mark as paid ---------- */

  booking.status = "paid";
  booking.paymentId = paymentId;
  booking.paidAt = new Date();
  booking.expiresAt = undefined; // ✅ Remove expiry - booking is permanent now

  await booking.save();

  return booking;
}

export async function initiatePayment(payload: {
  bookingId: string;
  date: string;
  slot: string;
}) {
  const { bookingId, date, slot } = payload;

  if (!isValidObjectId(bookingId)) {
    throw new Error("Invalid bookingId");
  }

  const [startStr, endStr] = slot.split("-");

  if (!startStr || !endStr) {
    throw new Error("Invalid slot format");
  }

  const startUTC = new Date(`${date}T${startStr}:00${IST_OFFSET}`);
  const endUTC = new Date(`${date}T${endStr}:00${IST_OFFSET}`);

  if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
    throw new Error("Invalid slot date or time");
  }

  if (endUTC <= startUTC) {
    throw new Error("End time must be after start time");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId, null, { session });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "payment_pending") {
      throw new Error("Booking is not eligible for payment");
    }

    if (booking.startTime || booking.endTime) {
      throw new Error("Slot already selected for this booking");
    }

    const expert = await Expert.findById(booking.expert, null, { session });

    if (!expert || !expert.isActive) {
      throw new Error("Expert not available");
    }

    const overlappingBooking = await Booking.findOne(
      {
        expert: booking.expert,
        _id: { $ne: booking._id }, // ✅ Exclude current booking
        status: { $in: ["paid", "confirmed", "payment_pending"] },
        startTime: { $exists: true, $lt: endUTC },
        endTime: { $exists: true, $gt: startUTC },
      },
      null,
      { session },
    );

    if (overlappingBooking) {
      throw new Error("Selected slot is no longer available");
    }

    booking.startTime = startUTC;
    booking.endTime = endUTC;

    // Save booking - this will trigger the unique index check
    // If another booking already claimed this slot, MongoDB will throw duplicate key error
    await booking.save({ session });

    await session.commitTransaction();
    // ✅ End session immediately after commit
    session.endSession();

    // ✅ Call payment OUTSIDE transaction (no try-catch wrapping it)
    const { redirectUrl } = await createBulkpePayment({
      bookingId: booking._id.toString(),
      amount: booking.price,
      name: booking.payer.name,
      email: booking.payer.email,
      phone: booking.payer.phone,
    });

    return {
      bookingId: booking._id,
      amount: booking.price,
      paymentUrl: redirectUrl,
    };
  } catch (err: any) {
    // ✅ Only abort if transaction is still active
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    // Handle duplicate key error (race condition when multiple users select same slot)
    if (err.code === 11000 || err.message?.includes("duplicate key")) {
      throw new Error(
        "This slot was just booked by another user. Please select a different time slot.",
      );
    }

    throw err;
  }
}

export async function listUserBookings({ userId, status }: ListBookingsInput) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid userId");
  }

  const filter: any = { user: userId };
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate({
      path: "expert",
      select: "_id name type price",
    })
    .sort({ startTime: -1 })
    .lean();

  return bookings.map((b) => ({
    id: b._id,
    status: b.status,

    startTime: b.startTime,
    endTime: b.endTime,
    duration: b.duration,
    price: b.price,
    timezone: b.slotTimezone,

    meetLink:
      b.status === "paid" || b.status === "confirmed" ? b.meetLink : undefined,

    cancelledAt: b.cancelledAt,

    expert: b.expert
      ? {
          id: b.expert._id,
          name: b.expert.name,
          type: b.expert.type,
          price: b.expert.price,
        }
      : null,
  }));
}

export async function listBookingsForExpert({
  expertId,
  status,
}: {
  expertId: string;
  status?: BookingStatus;
}) {
  if (!mongoose.isValidObjectId(expertId)) {
    throw new Error("Invalid expertId");
  }

  const filter: any = { expert: expertId };
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate({
      path: "user",
      select: "_id name email",
    })
    .sort({ startTime: -1 })
    .lean();

  return bookings.map((b) => ({
    id: b._id,
    status: b.status,

    startTime: b.startTime,
    endTime: b.endTime,
    duration: b.duration,
    price: b.price,
    timezone: b.slotTimezone,

    meetLink:
      b.status === "paid" || b.status === "confirmed" ? b.meetLink : undefined,

    cancelledAt: b.cancelledAt,

    user: b.user
      ? {
          id: b.user._id,
          name: b.user.name,
          email: b.user.email,
        }
      : null,
  }));
}
