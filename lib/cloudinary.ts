import { v2 as cloudinary, UploadApiResponse, DeleteApiResponse } from "cloudinary";
import fs from "fs/promises";
import { existsSync, createReadStream, statSync } from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  success: boolean;
  data?: UploadApiResponse;
  error?: string;
}

interface CloudinaryDeleteResult {
  success: boolean;
  data?: DeleteApiResponse;
  error?: string;
}

type ProgressCallback = (progress: number) => void;

/**
 * Uploads a file to Cloudinary with progress tracking
 * @param localFilePath - Path to the local file to upload
 * @param onProgress - Optional callback function that receives progress percentage (0-100)
 * @returns Promise with upload result containing success status and response data
 */
const uploadOnCloudinary = async (
  localFilePath: string,
  onProgress?: ProgressCallback
): Promise<CloudinaryUploadResult> => {
  try {
    if (!localFilePath) {
      return { success: false, error: "No file path provided" };
    }

    // Check if file exists before attempting upload
    if (!existsSync(localFilePath)) {
      return { success: false, error: "File does not exist" };
    }

    // Get file size for progress calculation
    const fileStats = statSync(localFilePath);
    const totalSize = fileStats.size;
    let uploadedSize = 0;

    // Create read stream with progress tracking
    const stream = createReadStream(localFilePath);
    
    // Track upload progress
    stream.on('data', (chunk: Buffer) => {
      uploadedSize += chunk.length;
      const progress = Math.round((uploadedSize / totalSize) * 100);
      
      if (onProgress) {
        onProgress(progress);
      }
    });

    // Upload the file to Cloudinary using stream
    const response = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload failed without error"));
        }
      );

      stream.pipe(uploadStream);
      
      stream.on('error', (error) => {
        reject(error);
      });
    });

    // Remove local file after successful upload
    await fs.unlink(localFilePath);

    // Ensure progress reaches 100%
    if (onProgress) {
      onProgress(100);
    }

    return { success: true, data: response };
  } catch (error) {
    // Attempt to clean up local file on error
    try {
      if (existsSync(localFilePath)) {
        await fs.unlink(localFilePath);
      }
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError);
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error uploading to Cloudinary:", errorMessage);
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Deletes an image from Cloudinary by public ID
 * @param publicId - The public ID of the image to delete
 * @param resourceType - Type of resource (default: "image")
 * @returns Promise with deletion result containing success status and response data
 */
const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" | "auto" = "image"
): Promise<CloudinaryDeleteResult> => {
  try {
    if (!publicId) {
      return { success: false, error: "No public ID provided" };
    }

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    // Check if deletion was successful
    if (response.result === "ok") {
      return { success: true, data: response };
    } else {
      return { 
        success: false, 
        error: `Deletion failed: ${response.result}` 
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error deleting from Cloudinary:", errorMessage);
    
    return { success: false, error: errorMessage };
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
export type { CloudinaryUploadResult, CloudinaryDeleteResult, ProgressCallback };