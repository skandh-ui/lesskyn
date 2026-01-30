/**
 * Migration script to fix booking index
 * Run this once to drop the old index and let Mongoose recreate it with the correct partialFilterExpression
 *
 * Usage: node --loader ts-node/esm lib/migrations/fixBookingIndex.ts
 * Or: npx tsx lib/migrations/fixBookingIndex.ts
 */

import { connectToDatabase } from "@/database/db";
import mongoose from "mongoose";

async function fixBookingIndex() {
  try {
    console.log("🔄 Connecting to database...");
    await connectToDatabase();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }

    const collection = db.collection("bookings");

    console.log("📋 Current indexes:");
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Drop the problematic index
    const indexName = "expert_1_startTime_1_endTime_1";

    try {
      console.log(`\n🗑️  Dropping index: ${indexName}`);
      await collection.dropIndex(indexName);
      console.log("✅ Index dropped successfully");
    } catch (error: any) {
      if (error.code === 27 || error.message.includes("index not found")) {
        console.log("ℹ️  Index doesn't exist, nothing to drop");
      } else {
        throw error;
      }
    }

    // Import the model to let Mongoose recreate the index with the new definition
    console.log("\n🔨 Recreating index with correct configuration...");
    await import("@/models/booking.model");

    // Ensure indexes are created
    await mongoose.connection.syncIndexes();

    console.log("\n📋 New indexes:");
    const newIndexes = await collection.indexes();
    console.log(JSON.stringify(newIndexes, null, 2));

    console.log("\n✅ Migration completed successfully!");
    console.log(
      "The booking index now correctly handles draft bookings (null startTime/endTime)",
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Run migration
fixBookingIndex()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Error:", error);
    process.exit(1);
  });
