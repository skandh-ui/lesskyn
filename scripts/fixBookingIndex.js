/**
 * Quick fix for booking index issue
 * Run this in your terminal to fix the duplicate key error
 * Usage: node --env-file .env.local scripts/fixBookingIndex.js
 */

const { MongoClient } = require("mongodb");

async function fixIndex() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    console.error(
      "Run with: node --env-file .env.local scripts/fixBookingIndex.js",
    );
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log("🔄 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("bookings");

    // Drop the old index
    console.log("\n🗑️  Dropping old index: expert_1_startTime_1_endTime_1");
    try {
      await collection.dropIndex("expert_1_startTime_1_endTime_1");
      console.log("✅ Old index dropped");
    } catch (error) {
      if (error.code === 27 || error.message.includes("index not found")) {
        console.log("ℹ️  Index already removed or does not exist");
      } else {
        throw error;
      }
    }

    // Create the new index with partialFilterExpression
    console.log("\n🔨 Creating new index with partialFilterExpression...");
    await collection.createIndex(
      { expert: 1, startTime: 1, endTime: 1 },
      {
        unique: true,
        partialFilterExpression: {
          startTime: { $exists: true, $type: "date" },
          endTime: { $exists: true, $type: "date" },
        },
        name: "expert_1_startTime_1_endTime_1",
      },
    );
    console.log("✅ New index created successfully");

    console.log("\n📋 Current indexes on bookings collection:");
    const indexes = await collection.indexes();
    const bookingIndex = indexes.find(
      (i) => i.name === "expert_1_startTime_1_endTime_1",
    );
    console.log(JSON.stringify(bookingIndex, null, 2));

    console.log("\n✅ Migration completed successfully!");
    console.log(
      "Draft bookings (with null startTime/endTime) will no longer cause duplicate key errors.",
    );
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n🔌 Connection closed");
  }
}

fixIndex();
