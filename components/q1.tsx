"use client";
import { useState } from "react";
import SkinTypeCard from "@/components/SkinTypeCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
// import { saveAnswer } from "../utils/saveResponse";

import img1 from "@/public/assets/img1.png";
import img2 from "@/public/assets/img2.png";
import img3 from "@/public/assets/img3.png";
import img4 from "@/public/assets/img4.png";
import img5 from "@/public/assets/img5.png";

const skinCards = [
  {
    title: "Normal Skin",
    Image: img1,
    helpText: "Balanced moisture and oil levels with minimal sensitivity.",
  },
  {
    title: "Oily Skin",
    Image: img2,
    helpText:
      "Produces excess sebum, often leading to shine and clogged pores.",
  },
  {
    title: "Dry Skin",
    Image: img3,
    helpText:
      "Lacks moisture and natural oils, causing tightness and flakiness.",
  },
  {
    title: "Combination Skin",
    Image: img4,
    helpText: "Oily in the T-zone and dry or normal on the cheeks.",
  },
  {
    title: "Sensitive Skin",
    Image: img5,
    helpText:
      "Reacts easily to products or environment, often with redness or irritation.",
  },
];

const Q1 = () => {
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (title: string) => {
    setSelected(title);

    // Auto-navigate after selection
    setTimeout(() => {
      const skinType = title.replace(" Skin", "").toLowerCase();
      localStorage.setItem("quiz_skinType", skinType);
      router.push("/quiz?step=2", { scroll: false });
    }, 300);
  };

  return (
    <div className="relative z-10 pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="font-garamond text-[24px] leading-[34px] sm:mt-10 sm:text-[40px] sm:leading-[44px] md:text-[52px] md:leading-[56px] lg:text-[64px] lg:leading-[64px] text-center">
        What is your skin type?
      </h1>

      {/* CARDS */}
      <div
        className="
          mt-10 sm:mt-14
          grid grid-cols-2 gap-1
          sm:grid-cols-3 sm:gap-4
          lg:grid-cols-5 lg:gap-5
          justify-items-center
          max-w-full
        "
      >
        {skinCards.map((card, index) => (
          <SkinTypeCard
            key={index}
            title={card.title}
            img={card.Image}
            selected={selected === card.title}
            helpText={card.helpText}
            onSelect={() => handleSelect(card.title)}
          />
        ))}
      </div>

      {/* BUTTONS */}
      <div className="mt-10 sm:mt-16 flex justify-center pb-10">
        <button
          onClick={() => router.push("/", { scroll: false })}
          className="font-garamond sm:font-crimson sm:font-semibold text-base sm:text-[20px] border border-black/50 bg-white text-black px-6 py-3 rounded-3xl sm:rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Previous
        </button>
      </div>
    </div>
  );
};

export default Q1;
