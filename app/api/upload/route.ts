import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (images only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 2MB" },
        { status: 400 },
      );
    }

    // Convert file to buffer and save temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temporary file path
    const tempFilePath = join(tmpdir(), `upload_${Date.now()}_${file.name}`);

    // Write buffer to temporary file
    await writeFile(tempFilePath, buffer);

    // Upload to Cloudinary
    const result = await uploadOnCloudinary(tempFilePath);

    if (!result.success || !result.data) {
      // Clean up temp file if upload failed
      try {
        await unlink(tempFilePath);
      } catch (e) {
        // Ignore cleanup errors
      }

      return NextResponse.json(
        { error: result.error || "Failed to upload image" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        url: result.data.secure_url,
        publicId: result.data.public_id,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 },
    );
  }
}
