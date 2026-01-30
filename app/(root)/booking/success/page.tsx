"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface BookingDetails {
  bookingId: string;
  transactionId: string;
  utr: string;
  amount: number;
  paymentMode: string;
  status: string;
  holderName: string;
  date?: string;
  time?: string;
  meetLink?: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking ID from URL params
    const bookingId =
      searchParams.get("bookingId") || searchParams.get("reference_id");

    if (!bookingId) {
      router.push("/booking");
      return;
    }

    // Fetch booking details
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch booking");
        }

        const data = await response.json();

        setBooking({
          bookingId: data.id,
          transactionId: data.paymentId || "N/A",
          utr: data.utr || "N/A",
          amount: data.price,
          paymentMode: data.paymentMode || "UPI",
          status: data.status,
          holderName: data.payer?.name || "N/A",
          date: data.startTime
            ? new Date(data.startTime).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : undefined,
          time: data.startTime
            ? new Date(data.startTime).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : undefined,
          meetLink: data.meetLink,
        });
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-white flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[100svh] bg-white flex items-center justify-center">
        <div className="text-white text-xl">Booking not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-[90svh] bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
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
          </div>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-1">
            Payment Successful!
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Your booking has been confirmed
          </p>

          {/* Booking Details in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-6 pb-6 border-b border-gray-200">
            <DetailRow label="Booking ID" value={booking.bookingId} compact />
            <DetailRow
              label="Transaction ID"
              value={booking.transactionId}
              compact
            />
            <DetailRow label="UTR Number" value={booking.utr} compact />
            <DetailRow
              label="Amount Paid"
              value={`₹${booking.amount}`}
              compact
            />
            <DetailRow
              label="Payment Mode"
              value={booking.paymentMode}
              compact
            />
            <DetailRow label="Payer Name" value={booking.holderName} compact />

            {booking.date && booking.time && (
              <>
                <DetailRow
                  label="Appointment Date"
                  value={booking.date}
                  compact
                />
                <DetailRow
                  label="Appointment Time"
                  value={booking.time}
                  compact
                />
              </>
            )}

            <DetailRow
              label="Status"
              value={booking.status.toUpperCase()}
              valueClass="text-green-600 font-semibold"
              compact
            />
          </div>

          {/* Meet Link */}
          {booking.meetLink && (
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-5 max-w-xs w-full">
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
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
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Google Meet Link
                </h3>
                <a
                  href={booking.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-700 hover:text-purple-900 break-all underline text-sm block text-center"
                >
                  {booking.meetLink}
                </a>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full cursor-pointer sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full cursor-pointer sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Go to Home
            </button>
          </div>

          {/* Support Note */}
          <p className="text-center text-xs text-gray-500">
            A confirmation email has been sent to your registered email address.
            <br />
            For any queries, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueClass = "text-gray-900",
  compact = false,
}: {
  label: string;
  value: string;
  valueClass?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center ${compact ? "py-1" : "py-3 border-b border-gray-100 last:border-0"}`}
    >
      <span className={`text-gray-600 font-medium ${compact ? "text-sm" : ""}`}>
        {label}
      </span>
      <span
        className={`font-semibold ${valueClass} ${compact ? "text-sm" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
