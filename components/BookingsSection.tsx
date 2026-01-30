"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import InfluencerCard from "@/components/InfluencerCard";
import DermatCard from "@/components/DermatCard";
import yellowBlob from "@/public/assets/yelo.svg";

interface Expert {
  id: string;
  name: string;
  type: "dermatologist" | "influencer";
  price: number;
  avatar?: string;
  degree?: string;
  experienceYears?: number;
  bio?: string;
}

interface Booking {
  id: string;
  status: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  price: number;
  timezone?: string;
  meetLink?: string;
  cancelledAt?: Date;
  expert: Expert | null;
}

interface BookingsSectionProps {
  userId: string;
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bookings/user?userId=${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data: Booking[] = await response.json();
        setBookings(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  // Filter only upcoming bookings (paid or confirmed)
  const upcomingBookings = bookings.filter(
    (booking) =>
      (booking.status === "paid" || booking.status === "confirmed") &&
      new Date(booking.startTime) > new Date(),
  );

  return (
    <div className="relative mt-8 w-full overflow-hidden rounded-3xl border border-gray-200 bg-white py-8 pl-8 shadow-sm">
      {/* Decoration Blob */}
      <div className="absolute right-20 top-6 w-14 rotate-[-15deg] opacity-90 pointer-events-none">
        <Image src={yellowBlob} alt="decoration" width={80} height={80} />
      </div>

      {/* Header Row */}
      <div className="relative z-10 mb-6 flex items-center justify-between pr-8">
        <h2 className="font-serif text-3xl text-gray-800">Your Bookings</h2>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bookings Slider Container */}
      <div
        className="flex w-full items-center gap-4 overflow-x-auto pb-6 pr-8 snap-x scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loading ? (
          <div className="flex items-center justify-center w-full py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 italic">{error}</p>
        ) : upcomingBookings.length > 0 ? (
          upcomingBookings.map((booking) => {
            if (!booking.expert) return null;

            const expertType = booking.expert.type;
            const isInfluencer = expertType === "influencer";

            return (
              <div key={booking.id} className="snap-center shrink-0">
                <div className="w-fit">
                  {isInfluencer ? (
                    <InfluencerCard
                      variant="booked"
                      size="compact"
                      date={booking.startTime.toString()}
                      name={booking.expert.name}
                      subtitle={booking.expert.bio}
                      avatar={booking.expert.avatar}
                      price={`₹${booking.price}`}
                      duration={`${booking.duration} mins`}
                      bookingId={booking.id}
                    />
                  ) : (
                    <DermatCard
                      variant="booked"
                      date={booking.startTime.toString()}
                      name={booking.expert.name}
                      qualifications={booking.expert.degree}
                      size="compact"
                      experience={
                        booking.expert.experienceYears
                          ? `${booking.expert.experienceYears} years`
                          : undefined
                      }
                      avatar={booking.expert.avatar}
                      price={`₹${booking.price}`}
                      duration={`${booking.duration} mins`}
                      bookingId={booking.id}
                    />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 italic">No upcoming bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default BookingsSection;
