import { connectToDatabase } from "@/database/db";
import { User } from "@/models/user.model";

/**
 * Migration script to add provider field to existing users
 * Run this once to update all existing users
 */
async function migrateExistingUsers() {
  try {
    await connectToDatabase();
    console.log("Connected to database");

    // Find all users without a provider field
    const usersWithoutProvider = await User.find({
      $or: [{ provider: { $exists: false } }, { provider: null }],
    });

    console.log(
      `Found ${usersWithoutProvider.length} users without provider field`,
    );

    // Update each user
    for (const user of usersWithoutProvider) {
      // If user has a password, they used credentials
      // If user has no password, they likely used OAuth (assume Google for now)
      const provider = user.password ? "credentials" : "google";

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            provider: provider,
          },
        },
      );

      console.log(`Updated user ${user.email} with provider: ${provider}`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    process.exit(0);
  }
}

migrateExistingUsers();
