"use client"; // Needed for useState

import { Instagram, Twitter, Facebook } from "lucide-react";
import { useRouter } from "next/navigation";
import pp from "@/public/assets/avatar.svg";
import Image from "next/image";

type SocialLinks = {
  instagram?: string;
  twitter?: string;
  facebook?: string;
};

type InfluencerCardProps = {
  name?: string;
  subtitle?: string;
  avatar?: string;
  socials?: SocialLinks;
  price?: string;
  duration?: string;
  expertId?: string;
  // NEW PROPS
  variant?: "normal" | "booked";
  date?: string | Date;
  size?: "normal" | "compact";
  bookingId?: string;
  hideButton?: boolean;
  onButtonClick?: () => void;
};

const DEFAULT_AVATAR = pp;

const InfluencerCard = ({
  name = "Orlando Diggs",
  subtitle = "Talk to me on acne, hyperpigmentation, and all things oily skin.",
  avatar,
  socials = { instagram: "#", twitter: "#", facebook: "#" },
  price = "₹100",
  duration = "15 mins",
  expertId,
  variant = "normal",
  date,
  size = "normal",
  bookingId,
  hideButton = false,
  onButtonClick,
}: InfluencerCardProps) => {
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
  const avatarSize = isCompact ? "h-24 w-24" : "h-32 w-32";
  const nameSize = isCompact ? "text-[22px]" : "text-[28px]";
  const subtitleSize = isCompact ? "text-[17px]" : "text-[21px]";
  const buttonHeight = isCompact ? "h-[48px]" : "h-[56px]";
  const buttonTextSize = isCompact ? "text-[18px]" : "text-[22px]";
  const footerTextSize = isCompact ? "text-[18px]" : "text-[22px]";
  const dateTextSize = isCompact ? "text-[26px]" : "text-[32px]";
  const padding = isCompact ? "p-6 pb-3" : "p-8 pb-4";

  return (
    // FIX 1: Added 'flex flex-col relative' to ensure footer stays at bottom and gradient positions correctly
    <div
      className={`relative flex flex-col ${cardWidth} ${cardHeight} overflow-hidden rounded-[32px] border-[8px] border-[#E5E7EB] bg-white shadow-lg`}
    >
      <div className={`${padding} relative z-20 flex flex-col flex-1`}>
        {/* Top Section: Avatar and Info */}
        <div
          className={`flex items-center ${
            isCompact ? "gap-4 mb-4" : "gap-6 mb-6"
          }`}
        >
          <div
            className={`relative ${avatarSize} shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm`}
          >
            <Image
              src={avatar || DEFAULT_AVATAR}
              alt={name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className={`${nameSize} font-bold tracking-tight text-black`}>
              {name}
            </h3>
            {socials?.instagram && (
              <p
                className={`${
                  isCompact ? "text-xs" : "text-sm"
                } font-medium text-gray-400`}
              >
                {(() => {
                  const url = socials.instagram;
                  // Extract username from Instagram URL
                  const match = url.match(/instagram\.com\/([^/?]+)/);
                  return match ? `instagram.com/${match[1]}` : url;
                })()}
              </p>
            )}
            {/* Social icons */}
            <div
              className={`flex items-center ${
                isCompact ? "gap-3 mt-1" : "gap-4 mt-2"
              }`}
            >
              {socials?.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(
                      socials.instagram,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                >
                  <Instagram
                    className={`${isCompact ? "w-5 h-5" : "w-6 h-6"} text-black`}
                    strokeWidth={2}
                  />
                </a>
              )}
              {socials?.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(
                      socials.twitter,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                >
                  <Twitter
                    className={`${isCompact ? "w-5 h-5" : "w-6 h-6"} fill-black`}
                    strokeWidth={1}
                  />
                </a>
              )}
              {socials?.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(
                      socials.facebook,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                >
                  <Facebook
                    className={`${isCompact ? "w-5 h-5" : "w-6 h-6"} fill-black`}
                    strokeWidth={1}
                  />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Subtitle / Bio */}
        <div
          className={`${isCompact ? "mb-6 min-h-[40px]" : "mb-8 min-h-[50px]"}`}
        >
          <p
            className={`${subtitleSize} leading-snug text-gray-400 font-medium`}
          >
            {subtitle}
          </p>
        </div>

        {/* CTA Button - Only show if NOT booked and not hidden */}
        {!isBooked && !hideButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onButtonClick) {
                onButtonClick();
              } else if (expertId) {
                router.push(`/booking/${expertId}`);
              }
            }}
            className={`w-full ${buttonHeight} mt-auto flex items-center justify-center rounded-[20px] bg-[#FCFCA2] border border-black/10 ${buttonTextSize} font-bold text-black transition-transform active:scale-[0.98] cursor-pointer hover:bg-[#fcfc90]`}
          >
            Talk Now
          </button>
        )}
      </div>

      {/* FIX 2: Moved Gradient OUT of the footer text div. 
          Positioned absolute to bottom-0.
          Increased height for booked variant to match reference image visual. */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#B34B87] to-transparent opacity-80 pointer-events-none z-10 ${
          isBooked ? "h-64" : "h-40"
        }`}
      />

      {/* Footer Text Section */}
      {/* FIX 3: Added 'mt-auto' to push this section to the bottom */}
      <div
        className={`relative z-20 mt-auto ${
          isCompact ? "px-6 py-4" : "px-8 py-5"
        }`}
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
              } font-medium text-gray-700 opacity-80 mb-1`}
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
                isCompact ? "mb-3" : "mb-4"
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
  );
};

export default InfluencerCard;
