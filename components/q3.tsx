"use client";
import { useState } from "react";
import SkinTypeCard from "@/components/SkinTypeCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
// import { saveAnswer } from "../utils/saveResponse";

import img1 from "@/public/assets/organic.png";
import img2 from "@/public/assets/budget.png";

const skinCards = [
  {
    title: "Organic",
    Image: img1,
    helpText:
      "Made with natural, plant-based ingredients and free from harsh chemicals.",
  },
  {
    title: "Budget Friendly",
    Image: img2,
    helpText:
      "Effective skincare options designed to deliver results without high cost.",
  },
];

const Q3 = () => {
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };

  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    setSelected(newSelected);

    // Auto-navigate after selection with a delay
    if (newSelected.length > 0) {
      setTimeout(() => {
        localStorage.setItem("quiz_preference", newSelected.join(", "));
        router.push("/quiz?step=4", { scroll: false });
      }, 300);
    }
  };

  return (
    <div className="relative z-10 pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="font-garamond text-[24px] leading-[34px] sm:mt-10 sm:text-[40px] sm:leading-[44px] md:text-[52px] md:leading-[56px] lg:text-[64px] lg:leading-[64px] text-center">
        Preferred Skincare Ingredients
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
            selected={selected.includes(card.title)}
            onSelect={() => handleSelect(card.title)}
          />
        ))}
      </div>

      <div className="mt-10 sm:mt-20 flex justify-center pb-10 sm:pb-20">
        <button
          onClick={() => router.push("/quiz?step=2", { scroll: false })}
          className="font-garamond sm:font-crimson sm:font-semibold text-base sm:text-[20px] border border-black/50 bg-white text-black px-6 py-3 rounded-3xl sm:rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Previous
        </button>
      </div>
    </div>
  );
};

export default Q3;
