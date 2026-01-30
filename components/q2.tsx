"use client";
import { useState } from "react";
import SkinTypeCard from "@/components/SkinTypeCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
// import { saveAnswer } from "../utils/saveResponse";

import img1 from "@/public/assets/Minimal.png";
import img2 from "@/public/assets/Moderate.png";
import img3 from "@/public/assets/Intensive.png";

const skinCards = [
  {
    title: "Minimal",
    Image: img1,
    helpText: "Low-effort routine with only essential steps for maintenance.",
  },
  {
    title: "Moderate",
    Image: img2,
    helpText:
      "Balanced routine with a few targeted products for noticeable improvement.",
  },
  {
    title: "Extensive",
    Image: img3,
    helpText:
      "High-commitment routine with multiple steps for maximum results.",
  },
];

const Q2 = () => {
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (title: string) => {
    setSelected(title);

    // Auto-navigate after selection
    setTimeout(() => {
      localStorage.setItem("quiz_commitment", title.toLowerCase());
      router.push("/quiz?step=3", { scroll: false });
    }, 300);
  };

  return (
    <div className="relative z-10 pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="font-garamond text-[24px] leading-[34px] sm:mt-10 sm:text-[40px] sm:leading-[44px] md:text-[52px] md:leading-[56px] lg:text-[64px] lg:leading-[64px] text-center">
        Skincare Routine Commitment Level
      </h1>

      <div
        className="
            mt-10 sm:mt-14
            grid grid-cols-1 gap-1
            sm:flex sm:flex-wrap sm:justify-center sm:gap-4
            lg:gap-6
            justify-items-center
          "
      >
        {skinCards.map((card, index) => (
          <SkinTypeCard
            key={index}
            title={card.title}
            img={card.Image}
            helpText={card.helpText}
            selected={selected === card.title}
            onSelect={() => handleSelect(card.title)}
          />
        ))}
      </div>

      <div className="mt-10 sm:mt-20 flex justify-center pb-10 sm:pb-20">
        <button
          onClick={() => router.push("/quiz?step=1", { scroll: false })}
          className="font-garamond sm:font-crimson sm:font-semibold text-base sm:text-[20px] border border-black/50 bg-white text-black px-6 py-3 rounded-3xl sm:rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Previous
        </button>
      </div>
    </div>
  );
};

export default Q2;
