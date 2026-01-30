"use client";

import React from "react";
import Image from "next/image";
import { NumberTicker } from "@/components/ui/number-ticker";

// Assets
import brands50 from "@/public/assets/brands50.svg";
import dermat10 from "@/public/assets/dermat10.svg";
import influencer40 from "@/public/assets/influencer40.svg";

const StatsGroup = () => {
  return (
    <div className="w-full bg-transparent py-2">
      <div className="w-full mx-auto px-2">
        {/* Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-2">
          {/* --- Item 1: Brands --- */}
          <div className="flex items-center justify-center gap-4 px-4 md:border-r border-black/30">
            {/* Text Side */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-baseline">
                <NumberTicker
                  value={50}
                  className="text-5xl md:text-6xl font-bold tracking-tight text-black"
                />
                <span className="text-5xl md:text-6xl font-bold text-black">
                  +
                </span>
              </div>
              <p className="text-xs md:text-sm font-semibold leading-tight mt-1 text-black max-w-[140px]">
                Dermat-Backed Brands
              </p>
            </div>
            {/* Icon Side */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
              <Image
                src={brands50}
                alt="Brands"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* --- Item 2: Dermatologists --- */}
          <div className="flex items-center justify-center gap-4 px-4 md:border-r border-black/30">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-baseline">
                <NumberTicker
                  value={10}
                  className="text-5xl md:text-6xl font-bold tracking-tight text-black"
                />
                <span className="text-5xl md:text-6xl font-bold text-black">
                  +
                </span>
              </div>
              <p className="text-xs md:text-sm font-semibold leading-tight mt-1 text-black">
                Clinical Skin Experts
              </p>
            </div>
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
              <Image
                src={dermat10}
                alt="Dermatologists"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* --- Item 3: Influencers --- */}
          <div className="flex items-center justify-center gap-4 px-4">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-baseline">
                <NumberTicker
                  value={40}
                  className="text-5xl md:text-6xl font-bold tracking-tight text-black"
                />
                <span className="text-5xl md:text-6xl font-bold text-black">
                  +
                </span>
              </div>
              <p className="text-xs md:text-sm font-semibold leading-tight mt-1 text-black">
                Skin Besties
              </p>
            </div>
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
              <Image
                src={influencer40}
                alt="Influencers"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsGroup;
