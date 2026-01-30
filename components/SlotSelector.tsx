"use client";

import { useState, useEffect, useRef } from "react";

interface SlotSelectorProps {
  expertId: string;
  duration: number;
  expertType: "dermatologist" | "influencer";
  onSlotSelect: (date: string, slot: string) => void;
  onBack?: () => void;
  refreshTrigger?: number; // Add this to allow parent to trigger refresh
}

interface AvailableSlots {
  [date: string]: string[]; // e.g., { "2026-01-20": ["10:00-10:30", "11:00-11:30"] }
}

const SlotSelector = ({
  expertId,
  duration,
  expertType,
  onSlotSelect,
  onBack,
  refreshTrigger = 0,
}: SlotSelectorProps) => {
  const [slots, setSlots] = useState<AvailableSlots>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  // Determine colors based on expert type
  const colors = {
    primary: expertType === "dermatologist" ? "#22C55E" : "#B34B87",
    primaryHover: expertType === "dermatologist" ? "#16A34A" : "#9d3f74",
    bg: expertType === "dermatologist" ? "green-50" : "pink-50",
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setLoading(true);
        const response = await fetch(
          `/api/bookings/slots?expertId=${expertId}&duration=${duration}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch available slots");
        }

        const data: AvailableSlots = await response.json();
        setSlots(data);

        // Auto-select first available date
        const dates = Object.keys(data).sort();
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setError("Failed to load available time slots");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [expertId, duration, refreshTrigger]); // Add refreshTrigger to dependencies

  const formatDate = (dateStr: string) => {
    // Parse date string directly as YYYY-MM-DD (assumes local date)
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    if (dateOnly.getTime() === today.getTime()) {
      return "Today";
    } else if (dateOnly.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatDayOfWeek = (dateStr: string) => {
    // Parse date string directly as YYYY-MM-DD (assumes local date)
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset slot selection when date changes
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (selectedDate && selectedSlot) {
      onSlotSelect(selectedDate, selectedSlot);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.primary }}
          ></div>
          <p className="text-gray-600">Loading available slots...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const availableDates = Object.keys(slots).sort();

  if (availableDates.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-600 mb-2 font-semibold">No slots available</p>
        <p className="text-gray-500 text-sm mb-6">
          This expert has no available slots in the next 14 days
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  const selectedDateSlots = selectedDate ? slots[selectedDate] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Select Date & Time
        </h2>
        <p className="text-gray-600 text-sm">
          Choose your preferred date and time slot
        </p>
      </div>

      {/* Date Selector - Horizontal Scroll */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Date <span className="text-red-500">*</span>
        </label>
        <div
          ref={dateScrollRef}
          className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {availableDates.map((date) => {
            const isSelected = date === selectedDate;
            return (
              <button
                key={date}
                onClick={() => handleDateSelect(date)}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all min-w-[100px] ${
                  isSelected
                    ? `border-[${colors.primary}] bg-[${colors.primary}] text-white shadow-md`
                    : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white"
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary,
                      }
                    : {}
                }
              >
                <div className="text-center">
                  <div className="text-xs font-medium opacity-90">
                    {formatDayOfWeek(date)}
                  </div>
                  <div className="text-sm font-semibold mt-1">
                    {formatDate(date)}
                  </div>
                  <div className="text-xs mt-1 opacity-80">
                    {slots[date].length} slots
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selector */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Available Time Slots <span className="text-red-500">*</span>
            <span className="text-gray-500 font-normal ml-1">
              ({duration} minutes session)
            </span>
          </label>

          {selectedDateSlots.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No slots available for this date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {selectedDateSlots.map((slot) => {
                const isSelected = slot === selectedSlot;
                const [startTime] = slot.split("-");

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSlotSelect(slot)}
                    className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? `border-[${colors.primary}] bg-[${colors.primary}] text-white shadow-md`
                        : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white"
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: colors.primary,
                            backgroundColor: colors.primary,
                          }
                        : {}
                    }
                  >
                    {startTime}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedSlot}
          className="flex-1 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: colors.primary,
            color: "white",
          }}
          onMouseEnter={(e) => {
            if (selectedDate && selectedSlot) {
              e.currentTarget.style.backgroundColor = colors.primaryHover;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
          }}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default SlotSelector;
