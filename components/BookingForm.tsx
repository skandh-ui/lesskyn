"use client";

import { useState } from "react";

interface BookingFormProps {
  onSubmit: (formData: BookingFormData) => void;
  expertType: "dermatologist" | "influencer";
}

export interface BookingFormData {
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
}

const skinTypes = [
  "Normal",
  "Dry",
  "Oily",
  "Combination",
  "Sensitive",
  "Acne-Prone",
];

const concernOptions = [
  "Natural Glow",
  "Anti-Aging: Reduce Wrinkles & Fine Lines",
  "Clear Acne & Breakouts",
  "Hydrate Dry Skin",
  "Minimize Pores & Blackheads",
  "Pigmentation & Reduce Dark Spots",
  "Reduce Oiliness & Shine",
  "Reduce Redness & Sensitivity",
];

const BookingForm = ({ onSubmit, expertType }: BookingFormProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    skinType: "",
    concerns: [],
    description: "",
    attachments: [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>(
    {},
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConcernToggle = (concern: string) => {
    setFormData((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (imageFiles.length + files.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    const newFiles = files.slice(0, 3 - imageFiles.length);
    setImageFiles((prev) => [...prev, ...newFiles]);

    // Create previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Upload to Cloudinary
    setUploading(true);
    try {
      const uploadedAttachments: {
        url: string;
        title?: string;
        mimeType?: string;
      }[] = [];

      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("upload_preset", "leskynn");

        const startIndex = imageFiles.length + i;
        setUploadProgress((prev) => ({ ...prev, [startIndex]: 0 }));

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dcpb1ewuk/image/upload`,
          {
            method: "POST",
            body: uploadFormData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Cloudinary error:", errorData);
          throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        uploadedAttachments.push({
          url: data.secure_url,
          title: file.name,
          mimeType: file.type,
        });

        setUploadProgress((prev) => ({ ...prev, [startIndex]: 100 }));
      }

      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...uploadedAttachments],
      }));
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      alert(
        `Failed to upload images: ${errorMessage}. Please check if the upload preset 'leskynn' is configured in Cloudinary.`,
      );
      // Remove failed uploads
      setImageFiles((prev) => prev.slice(0, -newFiles.length));
      setImagePreviews((prev) => prev.slice(0, -newFiles.length));
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.skinType) {
      alert("Please select your skin type");
      return;
    }

    if (formData.concerns.length === 0) {
      alert("Please select at least one concern");
      return;
    }

    // Pass form data to parent
    onSubmit(formData);
  };

  const primaryColor = expertType === "dermatologist" ? "#42c0a1" : "#B34B87";

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Personal Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                style={{ focusRingColor: primaryColor }}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                style={{ focusRingColor: primaryColor }}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                style={{ focusRingColor: primaryColor }}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
          </div>
        </div>

        {/* Skin Information */}
        <div className="pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Skin Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skin Type <span className="text-red-500">*</span>
              </label>
              <select
                name="skinType"
                value={formData.skinType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                style={{ focusRingColor: primaryColor }}
                required
              >
                <option value="">Select your skin type</option>
                {skinTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Skin Concerns <span className="text-red-500">*</span>
                <span className="text-gray-500 font-normal ml-1">
                  (Select all that apply)
                </span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {concernOptions.map((concern) => (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => handleConcernToggle(concern)}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.concerns.includes(concern)
                        ? "text-white"
                        : "border-gray-300 text-gray-700"
                    }`}
                    style={{
                      borderColor: formData.concerns.includes(concern)
                        ? primaryColor
                        : undefined,
                      backgroundColor: formData.concerns.includes(concern)
                        ? primaryColor
                        : undefined,
                    }}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details
                <span className="text-gray-500 font-normal ml-1">
                  (Optional)
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition resize-none"
                style={{ focusRingColor: primaryColor }}
                placeholder={
                  expertType === "dermatologist"
                    ? "Tell us more about your skin concerns, current routine, allergies, etc."
                    : "Tell us more about your skin concerns, current routine, products you love, etc."
                }
              />
            </div>

            {/* Image Upload - Only for Dermatologists */}
            {expertType === "dermatologist" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photos
                  <span className="text-gray-500 font-normal ml-1">
                    (Optional, max 3)
                  </span>
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Clear photos help our experts provide better recommendations
                </p>

                {imagePreviews.length < 3 && (
                  <label
                    className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition"
                    style={{
                      borderColor:
                        imagePreviews.length > 0 ? primaryColor : undefined,
                    }}
                  >
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload images
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={uploading}
            className="w-full text-white py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: primaryColor,
            }}
          >
            {uploading ? "Uploading images..." : "Continue to Select Time Slot"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
