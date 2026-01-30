"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

// --- Component Imports ---
import BookingsSection from "@/components/BookingsSection";

// --- SVG Imports ---
import yellowBlob from "@/public/assets/yelo.svg";
import blueB from "@/public/assets/bluebpot.svg";
import pinkBottle from "@/public/assets/pinkBottle.svg";
import orange from "@/public/assets/orangeCine.svg";
import yellowBottle from "@/public/assets/yellobottle.svg";
import star from "@/public/assets/Star 13.svg";

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [skinDetails, setSkinDetails] = useState({
    skinType: "",
    concerns: [],
    commitment: "",
    preference: "",
  });
  const [formData, setFormData] = useState(skinDetails);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      if (data.user?.skinDetails) {
        const details = {
          skinType: data.user.skinDetails.skinType || "",
          concerns: data.user.skinDetails.concerns || [],
          commitment: data.user.skinDetails.commitment || "",
          preference: data.user.skinDetails.preference || "",
        };
        setSkinDetails(details);
        setFormData(details);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skinDetails: formData }),
      });

      if (!response.ok) throw new Error("Failed to update");

      const data = await response.json();
      if (data.user?.skinDetails) {
        const details = {
          skinType: data.user.skinDetails.skinType,
          concerns: data.user.skinDetails.concerns,
          commitment: data.user.skinDetails.commitment,
          preference: data.user.skinDetails.preference,
        };
        setSkinDetails(details);
      }
      setShowUpdateModal(false);
      alert("Skin details updated successfully!");
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update skin details");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFE2DA] to-[#FFFFFF] p-6 md:p-10">
      {/* --- Background Blobs --- */}
      <div className="absolute -left-2 top-32 w-16 opacity-80 md:w-24 rotate-12">
        <Image src={pinkBottle} alt="decoration" width={100} height={100} />
      </div>
      <div className="absolute left-4 top-1/3 w-16 opacity-80 md:w-24 rotate-12">
        <Image src={star} alt="decoration" width={100} height={100} />
      </div>
      <div className="absolute right-1/3 top-19 w-12 md:w-16">
        <Image src={yellowBlob} alt="decoration" width={80} height={80} />
      </div>
      <div className="absolute -right-6 top-24 w-16 md:w-20 -rotate-12">
        <Image src={orange} alt="decoration" width={100} height={100} />
      </div>
      <div className="absolute right-2 top-1/2 w-10 md:w-14">
        <Image src={blueB} alt="decoration" width={60} height={60} />
      </div>
      <div className="absolute left-4 bottom-32 w-14 md:w-20">
        <Image src={yellowBottle} alt="decoration" width={80} height={80} />
      </div>

      {/* --- Main Content Container --- */}
      <div className="relative z-10 mx-auto max-w-6xl mt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-gray-800">Welcome Back !</h1>
          <p className="mt-2 text-gray-600">
            Here's your beauty profile summary
          </p>
        </div>

        {/* Horizontal Skin Details Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-xl text-gray-800">
              Your Beauty Profile
            </h2>
            <button
              onClick={() => {
                setFormData(skinDetails);
                setShowUpdateModal(true);
              }}
              className="rounded-full px-5 py-1.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#FFB881" }}
            >
              Update
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <p className="mb-2 text-sm text-gray-500">Skin Type</p>
              <p className="text-2xl font-medium text-black capitalize">
                {skinDetails.skinType || (
                  <span className="text-gray-400 text-xl">Not set</span>
                )}
              </p>
            </div>
            <div>
              <p className="mb-3 text-sm text-gray-500">Skin Concerns</p>
              <div className="flex flex-wrap gap-2">
                {skinDetails.concerns.length > 0 ? (
                  skinDetails.concerns.map((concern, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-green-200 bg-green-100 px-4 py-1 text-sm text-green-800"
                    >
                      {concern}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">Not set</span>
                )}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm text-gray-500">Commitment Level</p>
              {skinDetails.commitment ? (
                <span className="rounded-full border border-yellow-200 bg-yellow-100 px-4 py-1 text-sm text-yellow-800 capitalize">
                  {skinDetails.commitment}
                </span>
              ) : (
                <span className="text-gray-400 text-sm">Not set</span>
              )}
            </div>
            <div>
              <p className="mb-3 text-sm text-gray-500">Preference</p>
              {skinDetails.preference ? (
                <span className="rounded-full border border-pink-200 bg-pink-100 px-4 py-1 text-sm text-pink-800 capitalize">
                  {skinDetails.preference}
                </span>
              ) : (
                <span className="text-gray-400 text-sm">Not set</span>
              )}
            </div>
          </div>
        </div>

        {/* --- Your Bookings Section --- */}
        <BookingsSection userId={userId} />

        {/* --- NEW SECTION: Talk to Us --- */}
        <div className="mt-8 flex w-fit flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-10 py-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl text-gray-800">
            Have any Concerns? Talk to Us
          </h2>

          <div className="flex items-center gap-12">
            {/* WhatsApp Icon */}
            <button className="group transition-transform active:scale-95">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black group-hover:opacity-70"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              </svg>
            </button>

            {/* Mail Icon */}
            <a
              href="mailto:skandh@lesskyn.in"
              className="group transition-transform active:scale-95"
              style={{ pointerEvents: "auto" }}
            >
              <Mail
                className="h-8 w-8 text-black group-hover:opacity-70"
                strokeWidth={2}
              />
            </a>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Email: <span className="font-medium">skandh@lesskyn.in</span>
          </p>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-w-2xl w-full rounded-3xl bg-white p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="font-serif text-2xl text-gray-800 mb-6">
              Update Beauty Profile
            </h2>

            <form onSubmit={handleUpdateSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skin Type
                </label>
                <select
                  value={formData.skinType}
                  onChange={(e) =>
                    setFormData({ ...formData, skinType: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFB881] focus:outline-none"
                >
                  <option value="oily">Oily</option>
                  <option value="dry">Dry</option>
                  <option value="combination">Combination</option>
                  <option value="normal">Normal</option>
                  <option value="sensitive">Sensitive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commitment Level
                </label>
                <select
                  value={formData.commitment}
                  onChange={(e) =>
                    setFormData({ ...formData, commitment: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFB881] focus:outline-none"
                >
                  <option value="minimal">Minimal</option>
                  <option value="moderate">Moderate</option>
                  <option value="extensive">Extensive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preference
                </label>
                <select
                  value={formData.preference}
                  onChange={(e) =>
                    setFormData({ ...formData, preference: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FFB881] focus:outline-none"
                >
                  <option value="organic">Organic</option>
                  <option value="budget friendly">Budget Friendly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Skin Concerns
                  <span className="text-gray-500 font-normal ml-1">
                    (Select all that apply)
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {concernOptions.map((concern) => (
                    <button
                      key={concern}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          concerns: prev.concerns.includes(concern)
                            ? prev.concerns.filter((c) => c !== concern)
                            : [...prev.concerns, concern],
                        }));
                      }}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                        formData.concerns.includes(concern)
                          ? "border-[#FFB881] bg-[#FFB881] text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 rounded-lg text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#FFB881" }}
                >
                  {updating ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
