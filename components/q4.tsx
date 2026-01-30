"use client";
import { useState } from "react";
import SkinTypeCard from "@/components/SkinTypeCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
// import { saveAnswer } from "../utils/saveResponse";

import img1 from "@/public/assets/clearAcne.png";
import img2 from "@/public/assets/reduceOily.png";
import img3 from "@/public/assets/hydrateDrySkin.png";
import img4 from "@/public/assets/evenOutskin.png";
import img5 from "@/public/assets/MinimizePores.png";
import img6 from "@/public/assets/reduceRed.png";
import img7 from "@/public/assets/NaturalGlow.png";
import img9 from "@/public/assets/AntiAging.png";

const skinCards = [
  {
    title: "Clear Acne & Breakouts",
    Image: img1,
    helpText:
      "Targets clogged pores and bacteria to reduce active acne and prevent new breakouts.",
  },
  {
    title: "Reduce Oiliness & Shine",
    Image: img2,
    helpText:
      "Controls excess sebum to keep skin matte and minimize greasy buildup.",
  },
  {
    title: "Hydrate Dry Skin",
    Image: img3,
    helpText:
      "Restores moisture and strengthens the skin barrier to reduce dryness and flakiness.",
  },
  {
    title: "Minimize Pores & Blackheads",
    Image: img4,
    helpText:
      "Unclogs and tightens pores to reduce blackheads and improve skin texture.",
  },
  {
    title: "Even Out Skin Tone & Reduce Dark Spots",
    Image: img5,
    helpText:
      "Brightens dull areas and fades pigmentation for a more even, uniform complexion.",
  },
  {
    title: "Reduce Redness & Sensitivity",
    Image: img6,
    helpText:
      "Soothes irritation and strengthens skin to reduce redness and sensitivity reactions.",
  },
  {
    title: "Anti-Aging: Reduce Wrinkles & Fine Lines",
    Image: img9,
    helpText:
      "Boosts collagen and smooths skin to reduce wrinkles, fine lines, and signs of aging.",
  },
  {
    title: "Achieve a Natural Glow",
    Image: img7,
    helpText:
      "Enhances radiance by improving hydration, texture, and overall skin clarity.",
  },
];

const Q4 = () => {
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };

  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selected) {
      alert("Please select an option!");
      return;
    }

    localStorage.setItem("quiz_concern", selected);
    router.push("/outcome");
  };

  return (
    <div className="relative z-10 pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="font-garamond text-[24px] leading-[34px] sm:mt-10 sm:text-[40px] sm:leading-[44px] md:text-[52px] md:leading-[56px] lg:text-[64px] lg:leading-[64px] text-center">
        What&apos;s your Skincare Concern?
      </h1>

      <div
        className="
          mt-10 sm:mt-14
          grid grid-cols-2 gap-0.5
          sm:grid-cols-3 sm:gap-4
          lg:grid-cols-4 lg:gap-5
          justify-items-center
          max-w-full
        "
      >
        {skinCards.map((card, index) => (
          <SkinTypeCard
            key={index}
            title={card.title}
            img={card.Image}
            helpText={card.helpText}
            selected={selected === card.title}
            onSelect={() => setSelected(card.title)}
            mobileWidth="w-[160px]"
            mobileHeight="h-[220px]"
          />
        ))}
      </div>

      <div className="mt-10 sm:mt-20 flex justify-center gap-4 sm:gap-32 pb-10 sm:pb-20">
        <button
          onClick={() => router.push("/quiz?step=3", { scroll: false })}
          className="font-garamond sm:font-crimson sm:font-semibold text-base sm:text-[20px] border border-black/50 bg-white text-black px-6 py-3 rounded-3xl sm:rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Previous
        </button>

        <button
          onClick={handleSubmit}
          className="font-garamond sm:font-crimson sm:font-semibold text-base sm:text-[20px] border border-black/50 bg-white text-black px-6 py-3 rounded-3xl sm:rounded-xl flex items-center gap-2"
        >
          Submit <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default Q4;
