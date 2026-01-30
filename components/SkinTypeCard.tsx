"use client";
import { Info } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

const SkinTypeCard = ({
  title,
  img,
  selected,
  onSelect,
  mobileWidth,
  mobileHeight,
  mobileTextSize,
  helpText,
}: {
  title: string;
  img: string | StaticImageData;
  selected: boolean;
  onSelect: () => void;
  mobileWidth?: string;
  mobileHeight?: string;
  mobileTextSize?: string;
  helpText?: string;
}) => {
  const [flipped, setFlipped] = useState(false);

  const onHelpClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFlipped((p) => !p);
  };

  return (
    <div
      className={`
        relative  
        ${mobileWidth ? mobileWidth : "w-[140px]"} md:w-[220px]
        ${mobileHeight ? mobileHeight : "h-[200px]"} md:h-[300px]
        rounded-2xl overflow-hidden shadow-md border transition-all
        ${selected ? "border-black scale-105" : "border-neutral-200"}
        mb-2
      `}
      onClick={onSelect}
      style={{ perspective: "1000px" }}
    >
      {/* FLIP WRAPPER — WHOLE CARD FLIPS */}
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* -------------------------------------------------- */}
        {/* FRONT SIDE: IMAGE + INFO ICON + TITLE BAR          */}
        {/* -------------------------------------------------- */}
        <div
          className="absolute inset-0 bg-white flex flex-col items-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Icon */}
          <button
            onClick={onHelpClick}
            className="absolute top-2 right-2 md:top-3 md:right-3 cursor-pointer z-10"
          >
            <Info className="w-4 h-4 md:w-5 md:h-5 text-black/50" />
          </button>

          {/* Image */}
          <div className="pt-3 md:pt-10 pb-2 md:pb-4 flex justify-center flex-1 items-center">
            <Image
              src={img}
              alt={title}
              className="w-[110px] h-[110px] md:w-[140px] md:h-[140px] object-contain"
            />
          </div>

          {/* Bottom Bar */}
          <div
            className={`
              mt-auto w-full h-[40px] md:h-[60px]
              flex items-center justify-center text-center
              ${selected ? "bg-yellow-400" : "bg-yellow-200"}
            `}
          >
            <p
              className={`font-montserrat ${
                mobileTextSize ? mobileTextSize : "text-[13px]"
              } md:text-[18px] font-medium text-black px-2`}
            >
              {title}
            </p>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* BACK SIDE: HELP TEXT + SAME INFO ICON + TITLE BAR   */}
        {/* -------------------------------------------------- */}
        <div
          className="absolute inset-0 bg-white flex flex-col px-4 text-center"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Same info icon */}
          <button
            onClick={onHelpClick}
            className="absolute top-2 right-2 md:top-3 md:right-3 cursor-pointer z-10"
          >
            <Info className="w-4 h-4 md:w-5 md:h-5 text-black/50" />
          </button>

          {/* Center the help text vertically */}
          <div className="flex-1 flex items-center justify-center px-3">
            <p className="text-[12px] md:text-[15px] leading-snug text-black font-medium">
              {helpText}
            </p>
          </div>

          {/* Bottom title bar fixed height, never squeezed */}
          <div
            className={`
      h-[40px] md:h-[60px]
      flex items-center justify-center text-center
      ${selected ? "bg-yellow-400" : "bg-yellow-200"}
    `}
          >
            <p
              className={`font-montserrat ${
                mobileTextSize ? mobileTextSize : "text-[13px]"
              } md:text-[18px] font-medium text-black px-2`}
            >
              {title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinTypeCard;
