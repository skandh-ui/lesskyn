//this file is gonna be used for testing purposes no significant code here

import { getProductsAfterQuiz } from "@/controllers/product.controller";
import { connectToDatabase } from "@/database/db";
import {
  initiateBooking,
  initiatePayment,
  getAvailableSlotsForNext14Days,
} from "@/controllers/booking.controller";

// (async () => {
//   const products = await getProductsAfterQuiz({
//     commitment: "minimal",
//     skinType: "Oily", // Try with capital N
//     concern: "Hydrate Dry Skin",
//     preference: "Budget Friendly", // Try with exact case from CSV
//   });

//   console.log(JSON.stringify(products, null, 2));
// })();

/* ---------- Test Booking Payment Flow ---------- */
(async () => {
  try {
    // Connect to database
    await connectToDatabase();
    console.log("✓ Connected to database");

    const expertId = "6969016a1c77ec841a91b9d1";
    const userId = "6969029f512cfeb521ba6040";
    const duration = 30; // 30 minutes

    /* Step 1: Get available slots */
    console.log("\n📅 Fetching available slots...");
    const slots = await getAvailableSlotsForNext14Days({
      expertId,
      duration,
    });
    console.log("Available slots:", JSON.stringify(slots, null, 2));

    // Get first available date and slot
    const firstDate = Object.keys(slots)[0];
    const firstSlot = slots[firstDate]?.[0];

    if (!firstDate || !firstSlot) {
      console.error("❌ No available slots found!");
      process.exit(1);
    }

    console.log(`\nSelected: ${firstDate} at ${firstSlot}`);

    /* Step 2: Initiate booking */
    console.log("\n🎫 Initiating booking...");
    const booking = await initiateBooking(userId, {
      expertId,
      duration,
      formData: {
        name: "Animesh Sahoo",
        email: "animeshsahoo1986@gmail.com",
        phone: "+919876543210",
        skinType: "Oily",
        concerns: ["Acne", "Dark Spots"],
        description: "Need help with acne treatment",
        images: [],
      },
    });

    console.log("✓ Booking created:", {
      bookingId: booking.bookingId,
      amount: booking.amount,
      expiresAt: booking.expiresAt,
    });

    /* Step 3: Initiate payment */
    console.log("\n💳 Initiating payment...");
    const payment = await initiatePayment({
      bookingId: booking.bookingId.toString(),
      date: firstDate,
      slot: firstSlot,
    });

    console.log("✓ Payment initiated:", {
      bookingId: payment.bookingId,
      amount: payment.amount,
      paymentUrl: payment.paymentUrl,
    });

    console.log("\n🎉 Test completed successfully!");
    console.log(`\n🔗 Payment URL: ${payment.paymentUrl}`);

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Test failed:", error.message);
    console.error(error);
    process.exit(1);
  }
})();

// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import { User } from "@/models/user.model";
// import { Expert } from "@/models/expert.model";

// /* ---------- Configuration ---------- */
// import { createGoogleMeetEvent } from "./createGoogleMeetEvent";

// (async () => {
//   const meet = await createGoogleMeetEvent({
//     title: "Test Meeting",
//     description: "Testing Google Meet creation",
//     startTimeUTC: new Date(Date.now() + 10 * 60 * 1000),
//     endTimeUTC: new Date(Date.now() + 40 * 60 * 1000),
//     attendees: [
//       { email: "animeshsahoo1986@gmail.com" },
//     ],
//   });

//   console.log(meet);
// })();
