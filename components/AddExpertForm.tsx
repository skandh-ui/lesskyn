"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ExpertType = "dermatologist" | "influencer";
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

interface WeeklyAvailability {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

interface Unavailability {
  startDate: string;
  endDate: string;
  reason?: string;
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AddExpertForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Basic Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<ExpertType>("dermatologist");
  const [avatar, setAvatar] = useState("");

  // Booking Info
  const [durations, setDurations] = useState<string>("15,30,60");
  const [price, setPrice] = useState("");

  // Weekly Availability
  const [weeklyAvailability, setWeeklyAvailability] = useState<
    WeeklyAvailability[]
  >([{ day: "Monday", startTime: "09:00", endTime: "17:00" }]);

  // Unavailabilities
  const [unavailabilities, setUnavailabilities] = useState<Unavailability[]>(
    [],
  );

  // Social Links
  const [socials, setSocials] = useState<SocialLinks>({
    facebook: "",
    twitter: "",
    instagram: "",
  });

  // Dermatologist specific
  const [degree, setDegree] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Influencer specific
  const [bio, setBio] = useState("");

  // File upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setAvatar(data.url);
      setUploadProgress(100);

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const addWeeklySlot = () => {
    setWeeklyAvailability([
      ...weeklyAvailability,
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const removeWeeklySlot = (index: number) => {
    setWeeklyAvailability(weeklyAvailability.filter((_, i) => i !== index));
  };

  const updateWeeklySlot = (
    index: number,
    field: keyof WeeklyAvailability,
    value: string,
  ) => {
    const updated = [...weeklyAvailability];
    updated[index] = { ...updated[index], [field]: value };
    setWeeklyAvailability(updated);
  };

  const addUnavailability = () => {
    setUnavailabilities([
      ...unavailabilities,
      { startDate: "", endDate: "", reason: "" },
    ]);
  };

  const removeUnavailability = (index: number) => {
    setUnavailabilities(unavailabilities.filter((_, i) => i !== index));
  };

  const updateUnavailability = (
    index: number,
    field: keyof Unavailability,
    value: string,
  ) => {
    const updated = [...unavailabilities];
    updated[index] = { ...updated[index], [field]: value };
    setUnavailabilities(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Parse durations
      const durationsArray = durations
        .split(",")
        .map((d) => parseInt(d.trim()))
        .filter((d) => !isNaN(d) && d > 0);

      if (durationsArray.length === 0) {
        throw new Error("Please provide at least one valid duration");
      }

      // Filter out empty unavailabilities
      const validUnavailabilities = unavailabilities.filter(
        (u) => u.startDate && u.endDate,
      );

      // Filter out empty social links
      const validSocials: SocialLinks = {};
      if (socials.facebook) validSocials.facebook = socials.facebook;
      if (socials.twitter) validSocials.twitter = socials.twitter;
      if (socials.instagram) validSocials.instagram = socials.instagram;

      const payload = {
        name,
        email,
        phone,
        type,
        durations: durationsArray,
        price: parseFloat(price),
        weeklyAvailability,
        unavailabilities: validUnavailabilities,
        socials:
          Object.keys(validSocials).length > 0 ? validSocials : undefined,
        avatar: avatar || undefined,
        ...(type === "dermatologist" && {
          degree,
          experienceYears: parseInt(experienceYears),
          specialization,
        }),
        ...(type === "influencer" && {
          bio,
        }),
      };

      const response = await fetch("/api/admin/experts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create expert");
      }

      setSuccess("Expert created successfully! User account has been set up.");

      // Reset form
      setTimeout(() => {
        router.refresh();
        // Reset all fields
        setName("");
        setEmail("");
        setPhone("");
        setAvatar("");
        setDurations("15,30,60");
        setPrice("");
        setWeeklyAvailability([
          { day: "Monday", startTime: "09:00", endTime: "17:00" },
        ]);
        setUnavailabilities([]);
        setSocials({ facebook: "", twitter: "", instagram: "" });
        setDegree("");
        setExperienceYears("");
        setSpecialization("");
        setBio("");
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dr. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="expert@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ExpertType)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dermatologist">Dermatologist</option>
              <option value="influencer">Influencer</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Recommended: Square image, max 2MB
            </p>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg or upload below"
                />
                <label className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {uploading ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              {avatar && (
                <div className="mt-2">
                  <img
                    src={avatar}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Social Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="url"
              value={socials.facebook}
              onChange={(e) =>
                setSocials({ ...socials, facebook: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter
            </label>
            <input
              type="url"
              value={socials.twitter}
              onChange={(e) =>
                setSocials({ ...socials, twitter: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="url"
              value={socials.instagram}
              onChange={(e) =>
                setSocials({ ...socials, instagram: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </div>

      {/* Booking Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Booking Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Durations (minutes, comma-separated) *
            </label>
            <input
              type="text"
              value={durations}
              onChange={(e) => setDurations(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="15,30,60"
            />
            <p className="text-xs text-gray-500 mt-1">
              Available session durations in minutes
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Session *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100.00"
            />
          </div>
        </div>
      </div>

      {/* Weekly Availability */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Weekly Availability *
          </h3>
          <button
            type="button"
            onClick={addWeeklySlot}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
          >
            + Add Slot
          </button>
        </div>

        {weeklyAvailability.map((slot, index) => (
          <div
            key={index}
            className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day
              </label>
              <select
                value={slot.day}
                onChange={(e) => updateWeeklySlot(index, "day", e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) =>
                  updateWeeklySlot(index, "startTime", e.target.value)
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) =>
                  updateWeeklySlot(index, "endTime", e.target.value)
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {weeklyAvailability.length > 1 && (
              <button
                type="button"
                onClick={() => removeWeeklySlot(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Unavailabilities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Unavailabilities (Optional)
          </h3>
          <button
            type="button"
            onClick={addUnavailability}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
          >
            + Add Unavailability
          </button>
        </div>

        {unavailabilities.map((unavail, index) => (
          <div
            key={index}
            className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={unavail.startDate}
                onChange={(e) =>
                  updateUnavailability(index, "startDate", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={unavail.endDate}
                onChange={(e) =>
                  updateUnavailability(index, "endDate", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <input
                type="text"
                value={unavail.reason}
                onChange={(e) =>
                  updateUnavailability(index, "reason", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Vacation, Conference, etc."
              />
            </div>

            <button
              type="button"
              onClick={() => removeUnavailability(index)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Type-specific fields */}
      {type === "dermatologist" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Dermatologist Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree *
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="MBBS, MD Dermatology"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years) *
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization *
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Acne Treatment, Anti-aging, etc."
              />
            </div>
          </div>
        </div>
      )}

      {type === "influencer" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Influencer Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio *
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the influencer's expertise and audience..."
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating Expert..." : "Create Expert"}
        </button>
      </div>
    </form>
  );
}
