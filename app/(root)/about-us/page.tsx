import React from "react";
import Image from "next/image";
import Link from "next/link";

// Decorative Background Imports
import pinkBottle from "@/public/assets/pinkBottle.svg";
import yelo from "@/public/assets/yelo.svg";
import orange from "@/public/assets/orangeCine.svg";
import yellowBottle from "@/public/assets/yellobottle.svg";
import blueB from "@/public/assets/bluebpot.svg";

const Page = () => {
  return (
    <div className="relative min-h-screen bg-[#FFE4FA] overflow-hidden font-sans text-black selection:bg-pink-100">
      {/* ==========================================
          Background Decorative Elements (Absolute)
          ========================================== */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-12 left-8 md:left-24 w-12 md:w-16 opacity-90">
          <Image src={pinkBottle} alt="" />
        </div>
        <div className="absolute top-10 right-[22%] w-10 md:w-14 rotate-12">
          <Image src={yelo} alt="" />
        </div>
        <div className="absolute top-16 right-8 md:right-24 w-12 md:w-16">
          <Image src={orange} alt="" />
        </div>
        <div className="absolute top-[42%] -left-2 md:left-4 w-10 md:w-14">
          <Image src={yellowBottle} alt="" />
        </div>
        <div className="absolute top-[70%] right-8 md:right-20 w-10 md:w-14 rotate-12">
          <Image src={orange} alt="" className="opacity-70 scale-75" />
        </div>
        <div className="absolute bottom-32 left-10 md:left-28 w-10 md:w-14 scale-90">
          <Image src={yellowBottle} alt="" />
        </div>
        <div className="absolute bottom-24 right-10 md:right-28 w-10 md:w-14 rotate-45">
          <Image src={blueB} alt="" />
        </div>
      </div>

      {/* ==========================================
          Main Content Container
          ========================================== */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-28">
        {/* Page Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-center text-black mb-20 tracking-tight">
          About Us
        </h1>

        <div className="space-y-10">
          {/* --- SECTION 1: Skincare Chaos & Meet LesSkyn --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Skincare Chaos */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm">
              <h2 className="text-2xl font-bold text-black mb-5">The Skincare Chaos</h2>
              <div className="space-y-4 text-gray-800 font-medium leading-relaxed">
                <p>Skincare today is overwhelming.</p>
                <p>
                  Too many products. Too many opinions.
                  <br />
                  Too many routines that promise everything and deliver nothing.
                </p>
                <p>Skincare was meant to bring clarity — not stress.</p>
                <p>That&apos;s why LesSkyn exists.</p>
              </div>
            </div>

            {/* Meet LesSkyn */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm">
              <h2 className="text-2xl font-bold font-serif italic text-black mb-5">
                Meet LesSkyn
              </h2>
              <div className="space-y-4 text-gray-800 font-medium leading-relaxed">
                <p>
                  LesSkyn helps you understand your skin and make better skincare
                  decisions.
                </p>
                <p>
                  Learn what your skin needs, talk to dermatologists for expert
                  guidance, and connect with skincare besties for real experiences
                  and advice.
                </p>
                <p className="italic">No trends. No guesswork.</p>
                <p>Just skincare that makes sense for you.</p>
              </div>
            </div>
          </div>

          {/* --- SECTION 2: Personalised Routines & Talk to Experts --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personalised Routines */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col items-start">
              <h2 className="text-2xl font-bold mb-6 text-black">
                Personalised Routines
              </h2>
              <p className="text-gray-800 font-medium mb-6">
                At LesSkyn, we create routines based on:
              </p>

              {/* Mint Pills */}
              <div className="space-y-3 mb-6 w-full">
                <div className="flex gap-3">
                  <div className="bg-[#B6F5D9] rounded-full py-2 px-5 text-sm font-semibold text-black border border-black/5">
                    Skin Type
                  </div>
                  <div className="bg-[#B6F5D9] rounded-full py-2 px-5 text-sm font-semibold text-black border border-black/5">
                    Preference
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-[#B6F5D9] rounded-full py-2 px-5 text-sm font-semibold text-black border border-black/5">
                    Commitment Level
                  </div>
                  <div className="bg-[#B6F5D9] rounded-full py-2 px-5 text-sm font-semibold text-black border border-black/5">
                    Concerns
                  </div>
                </div>
              </div>

              <div className="text-gray-800 font-medium space-y-2 mt-auto">
                <p>No unnecessary steps. No 10-product pressure.</p>
                <p>Just a routine you&apos;ll actually stick to.</p>
              </div>
            </div>

            {/* Talk to Experts */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm">
              <h2 className="text-2xl font-bold text-black mb-5">Talk to Experts</h2>
              <div className="space-y-4 text-gray-800 font-medium leading-relaxed">
                <p>
                  Get guidance from qualified dermatologists and clinical experts
                  who understand real skin concerns.
                </p>
                <p>
                  Discuss your acne, pigmentation, sensitivity, or any ongoing issues.
                </p>
                <p>
                  Receive professional advice tailored to you — not generic internet
                  solutions.
                </p>
                <p className="italic">
                  Because sometimes, expert care makes all the difference.
                </p>
              </div>
            </div>
          </div>

          {/* --- SECTION 3: Talk to Skincare Besties --- */}
          <div className="bg-white rounded-[32px] p-8 md:p-14 shadow-sm text-center">
            <h2 className="text-2xl font-bold mb-8 text-black">
              Talk to Skincare Besties
            </h2>
            <div className="space-y-4 text-gray-800 font-medium leading-relaxed max-w-2xl mx-auto">
              <p>Sometimes you just need someone who&apos;s been through it.</p>
              <p>
                Connect with skincare enthusiasts who share honest experiences,
                routines, and lessons from their own journeys.
              </p>
              <p>No paid promotions.</p>
              <p>No scripted recommendations.</p>
              <p className="italic">
                Just real people sharing what worked — and what didn&apos;t.
              </p>
            </div>
          </div>

          {/* --- SECTION 4: Final Mission --- */}
          <div className="bg-white rounded-[32px] p-10 md:p-14 shadow-sm text-center">
            <p className="text-lg text-gray-800 font-medium mb-6">
              LesSkyn isn&apos;t about instant results.
            </p>
            <p className="text-xl md:text-2xl font-bold italic text-black mb-8 leading-relaxed">
              It&apos;s about consistency, understanding your skin, and building
              habits that last. The glow will follow. Periodt!
            </p>
            <p className="text-base md:text-lg font-medium text-gray-600">
              Your skin is unique. Your skincare should be too.
            </p>
          </div>
        </div>

        {/* Welcome & Get Started */}
        <div className="mt-20 text-center pb-10">
          <h2 className="text-4xl md:text-5xl italic font-normal text-black mb-8">
            Welcome to LesSkyn
          </h2>
          <Link
            href="/quiz"
            className="inline-block bg-[#222] text-white text-lg font-medium px-12 py-3 rounded-xl hover:bg-black transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;