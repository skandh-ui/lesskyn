"use client";

import { Instagram, Twitter, Facebook } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import pp from "@/public/assets/avatar.svg";
import sthethoscope_icon from "@/public/assets/sthethoscope_icon.svg";

interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

interface DermatCardProps {
  name?: string;
  qualifications?: string;
  experience?: string;
  details?: string;
  avatar?: string;
  socials?: SocialLinks;
  price?: string;
  duration?: string;
  // NEW PROPS
  variant?: "normal" | "booked";
  date?: string | Date;
  size?: "normal" | "compact";
  bookingId?: string;
}

const DEFAULT_AVATAR = pp;

const DermatCard = ({
  name = "Dr. Orlando Diggs",
  qualifications = "MD Dermatology,",
  experience = "10 Years Experience",
  details = "15 xyz",
  avatar,
  socials = { instagram: "#", twitter: "#", facebook: "#" },
  price = "₹100",
  duration = "15 mins",
  variant = "normal",
  date,
  size = "normal",
  bookingId,
}: DermatCardProps) => {
  const router = useRouter();
  // Helper logic for Booked Variant
  const isBooked = variant === "booked";
  const targetDate = date ? new Date(date) : new Date();
  const isUpcoming = targetDate > new Date();

  // Format date: "19 Dec, 2025"
  const formattedDate = targetDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Size-based styling
  const isCompact = size === "compact";
  const cardWidth = isCompact ? "w-[380px]" : "w-[500px]";
  const cardHeight = isCompact ? "h-[420px]" : "h-[500px]";
  const avatarSize = isCompact ? "h-20 w-20" : "h-28 w-28";
  const nameSize = isCompact ? "text-[21px]" : "text-[26px]";
  const iconSize = isCompact ? "w-4 h-4" : "w-5 h-5";
  const qualificationSize = isCompact ? "text-[13px]" : "text-[15px]";
  const socialIconSize = isCompact ? "w-6 h-6" : "w-7 h-7";
  const buttonHeight = isCompact ? "h-[44px]" : "h-[52px]";
  const buttonTextSize = isCompact ? "text-[15px]" : "text-[17px]";
  const footerTextSize = isCompact ? "text-[17px]" : "text-[20px]";
  const dateTextSize = isCompact ? "text-[24px]" : "text-[28px]";
  const padding = isCompact ? "pt-6 px-5" : "pt-8 px-6";

  return (
    <div
      className={`relative flex flex-col ${cardWidth} ${cardHeight} overflow-hidden rounded-[32px] border-[8px] border-[#E5E7EB] bg-white shadow-xl`}
    >
      {/* Content Section */}
      <div
        className={`relative z-20 flex flex-col items-center ${padding} text-center`}
      >
        {/* Avatar */}
        <div
          className={`relative ${avatarSize} ${
            isCompact ? "mb-3" : "mb-4"
          } overflow-hidden rounded-full border border-gray-100 shadow-sm`}
        >
          <Image
            src={avatar || DEFAULT_AVATAR}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Name & Stethoscope Icon */}
        <div
          className={`flex items-center gap-2 ${isCompact ? "mb-0.5" : "mb-1"}`}
        >
          <h3 className={`${nameSize} font-bold tracking-tight text-black`}>
            {name}
          </h3>
          <div className={`relative ${iconSize}`}>
            <Image
              src={sthethoscope_icon}
              alt="Stethoscope"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Qualifications / Subtitle */}
        <div
          className={`${
            isCompact ? "mb-3" : "mb-4"
          } ${qualificationSize} font-medium leading-relaxed text-gray-400`}
        >
          <p>{qualifications}</p>
          <p>{experience}</p>
          <p>{details}</p>
        </div>

        {/* Social Icons */}
        <div
          className={`flex items-center ${
            isCompact ? "gap-3 mb-4" : "gap-4 mb-6"
          }`}
        >
          <Instagram
            className={`${socialIconSize} text-black`}
            strokeWidth={2}
          />
          <Twitter
            className={`${socialIconSize} fill-black text-black`}
            strokeWidth={0}
          />
          <Facebook
            className={`${socialIconSize} fill-black text-black`}
            strokeWidth={0}
          />
        </div>

        {/* Book Button - Only show if NOT booked */}
        {!isBooked && (
          <button
            onClick={() => router.push("/")}
            className={`w-[80%] ${buttonHeight} ${
              isCompact ? "mb-3" : "mb-4"
            } flex items-center justify-center rounded-2xl bg-[#FFFFA2] border border-black/10 ${buttonTextSize} font-bold text-black shadow-sm transition-transform active:scale-[0.98] hover:brightness-105 cursor-pointer`}
          >
            Book Now
          </button>
        )}
      </div>

      {/* Footer Section with Green Gradient */}
      <div className="relative mt-auto w-full">
        {/* Adjusted gradient height for booked state to provide background for the date */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#42c0a1] via-[#42c0a1]/70 to-transparent pointer-events-none z-10 transition-all ${
            isBooked ? "h-64 opacity-90" : "h-32"
          }`}
        />

        {/* Footer Text Content */}
        <div
          className={`relative z-20 ${isCompact ? "px-6 py-4" : "px-8 py-5"}`}
        >
          {isBooked ? (
            // BOOKED VARIANT UI
            <div className="flex flex-col items-center justify-center pb-4 text-center">
              {bookingId && (
                <a
                  href={`/booking/success?bookingId=${bookingId}`}
                  className="text-md text-gray-500 hover:text-gray-700 underline mb-2"
                >
                  See booking details
                </a>
              )}
              <span
                className={`${
                  isCompact ? "text-base" : "text-lg"
                } font-bold text-gray-600 opacity-80 mb-1`}
              >
                {isUpcoming ? "Upcoming Call on" : "Last Call on"}
              </span>
              <span
                className={`${dateTextSize} font-bold text-black leading-none`}
              >
                {formattedDate}
              </span>
            </div>
          ) : (
            // NORMAL VARIANT UI
            <>
              <div
                className={`w-full h-[1px] bg-black/20 ${
                  isCompact ? "mb-2" : "mb-3"
                }`}
              />
              <div
                className={`flex justify-between items-center ${footerTextSize} font-medium text-black`}
              >
                <span>{duration}</span>
                <span>{price}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DermatCard;
