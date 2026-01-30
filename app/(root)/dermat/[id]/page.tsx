"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DermatCard from "@/components/DermatCard";
import BookingForm, { BookingFormData } from "@/components/BookingForm";
import SlotSelector from "@/components/SlotSelector";

interface Expert {
  id: string;
  name: string;
  type: string;
  price: number;
  durations: number[];
  avatar?: string;
  degree?: string;
  experienceYears?: number;
  specialization?: string;
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
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleFormSubmit = async (formData: BookingFormData) => {
    try {
      setIsProcessing(true);
      setBookingData(formData);

      // Call initiateBooking API
      const response = await fetch("/api/bookings/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expertId,
          duration: expert?.durations[0] || 30,
          formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create booking");
      }

      const data = await response.json();
      setBookingId(data.bookingId);
      setCurrentStep("slots");
      console.log("Booking initiated:", data);
    } catch (error) {
      console.error("Error initiating booking:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSlotSelect = async (date: string, slot: string) => {
    if (!bookingId) {
      alert("Booking ID not found. Please try again.");
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Slot selected:", { date, slot, bookingId });

      // Call initiatePayment API
      const response = await fetch("/api/bookings/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          date,
          slot,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initiate payment");
      }

      const data = await response.json();
      console.log("Payment initiated:", data);

      // Redirect to payment URL
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initiate payment. Please try again.";

      // Check if it's a slot conflict error
      if (
        errorMessage.includes("just booked") ||
        errorMessage.includes("no longer available")
      ) {
        alert(
          errorMessage +
            "\n\nThe available slots will be refreshed. Please select a different time.",
        );
        // Refresh the slots to show updated availability
        setSlotRefreshTrigger((prev) => prev + 1);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep("form");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42c0a1] mx-auto mb-4"></div>
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
            onClick={() => router.push("/dermat")}
            className="px-6 py-2 bg-[#42c0a1] text-white rounded-lg hover:bg-[#3aae8f] transition-colors"
          >
            Back to Experts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-8 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Book Your Consultation
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in your details to schedule a consultation
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Expert Card */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Consultation Details
              </h2>
              <div className="flex justify-center">
                <DermatCard
                  name={expert.name}
                  qualifications={expert.degree || "Dermatologist"}
                  experience={
                    expert.experienceYears
                      ? `${expert.experienceYears} Years Experience`
                      : "Experienced"
                  }
                  details={expert.specialization || "Skin Care Specialist"}
                  price={`₹${expert.price}`}
                  duration={`${expert.durations?.[0] || 30} mins`}
                  avatar={expert.avatar}
                  socials={expert.socials}
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
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
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
                    Personalized skin assessment
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
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
                    Expert recommendations
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
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
                    Digital prescription (if needed)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Dynamic Content */}
          {currentStep === "form" ? (
            <div className="relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-2xl">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42c0a1] mx-auto mb-4"></div>
                    <p className="text-gray-600">Creating booking...</p>
                  </div>
                </div>
              )}
              <BookingForm
                onSubmit={handleFormSubmit}
                expertType="dermatologist"
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-2xl">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42c0a1] mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing payment...</p>
                  </div>
                </div>
              )}
              {expert && (
                <SlotSelector
                  expertId={expertId}
                  duration={expert.durations[0] || 30}
                  expertType="dermatologist"
                  onSlotSelect={handleSlotSelect}
                  onBack={handleBackToForm}
                  refreshTrigger={slotRefreshTrigger}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
