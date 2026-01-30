"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InfluencerCard from "@/components/InfluencerCard";
import BookingForm, { BookingFormData } from "@/components/BookingForm";
import SlotSelector from "@/components/SlotSelector";

interface Expert {
  id: string;
  name: string;
  type: string;
  price: number;
  durations: number[];
  avatar?: string;
  bio?: string;
  socials?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const [expertId, setExpertId] = useState<string>("");
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"form" | "slots">("form");
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [slotRefreshTrigger, setSlotRefreshTrigger] = useState(0);

  // Resolve params and set expertId
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setExpertId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch expert data
  useEffect(() => {
    if (!expertId) return;

    const fetchExpert = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/experts/${expertId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch expert");
        }

        const data = await response.json();
        setExpert(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching expert:", err);
        setError("Failed to load expert details");
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, [expertId]);

  const handleFormSubmit = (data: BookingFormData) => {
    console.log("Form submitted:", data);
    setBookingData(data);
    setCurrentStep("slots");
  };

  const handleSlotSelect = async (date: string, slot: string) => {
    console.log("Slot selected:", { date, slot, bookingData });
    // TODO: Implement payment initiation for influencers
    alert(
      `Selected: ${date} at ${slot}\n\nPayment integration pending for influencers.`,
    );
  };

  const handleBackToForm = () => {
    setCurrentStep("form");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B34B87] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Expert not found"}</p>
          <button
            onClick={() => router.push("/booking")}
            className="px-6 py-2 bg-[#B34B87] text-white rounded-lg hover:bg-[#9d3f74] transition-colors"
          >
            Back to Influencers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Book Your Session
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in your details to schedule a session with your Skin Bestie
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Expert Card */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Session Details
              </h2>
              <div className="flex justify-center">
                <InfluencerCard
                  name={expert.name}
                  subtitle={expert.bio || "Skincare Expert"}
                  avatar={expert.avatar}
                  socials={expert.socials}
                  price={`₹${expert.price}`}
                  duration={`${expert.durations?.[0] || 30} mins`}
                  size="compact"
                />
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  What to expect:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Personalized skincare advice
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Real product recommendations
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Tips from personal experience
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
            {currentStep === "form" && (
              <BookingForm
                onSubmit={handleFormSubmit}
                expertType="influencer"
              />
            )}

            {currentStep === "slots" && expert && (
              <SlotSelector
                expertId={expertId}
                duration={expert.durations[0] || 30}
                expertType="influencer"
                onSlotSelect={handleSlotSelect}
                onBack={handleBackToForm}
                refreshTrigger={slotRefreshTrigger}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
