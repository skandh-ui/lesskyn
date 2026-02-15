"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// Component Imports
import StatsGroup from "@/components/StatsGroup";
import MCQStack from "@/components/MCQStack";
import DermatCardStack from "@/components/DermatCardStack";
import InfluencerCardStack from "@/components/InfluencerCardStack";

// Assets
import landing1 from "@/public/assets/landing1.svg";
import landing2 from "@/public/assets/landing2.svg";
import landing3 from "@/public/assets/landing3.svg";
import landing4 from "@/public/assets/landing4.svg";
import landing5 from "@/public/assets/landing5.svg";
import landing6 from "@/public/assets/landing6.svg";
import coming_soon1 from "@/public/assets/coming_soon1.svg";
import coming_soon2 from "@/public/assets/coming_soon2.svg";
import ComingSoonMarquee from "@/components/ComingSoonMarquee";

// --- DUMMY DATA ---
const QUESTIONS_DATA = [
  {
    id: 1,
    question: "What is your main skin concern?",
    options: [
      "Acne & Breakouts",
      "Hyperpigmentation",
      "Aging & wrinkles",
      "Dark Spots",
    ],
  },
  {
    id: 2,
    question: "How would you describe your skin type?",
    options: [
      "Oily & Shiny",
      "Dry & Flaky",
      "Combination",
      "Normal / Balanced",
    ],
  },
  {
    id: 3,
    question: "What is your primary skincare goal?",
    options: [
      "Glass Skin Glow",
      "Even Skin Tone",
      "Smooth Texture",
      "Clear & Acne-Free",
    ],
  },
  {
    id: 4,
    question: "What is your budget for a routine?",
    options: [
      "₹500 - ₹1500",
      "₹1500 - ₹3000",
      "₹3000 - ₹5000",
      "Price is no issue",
    ],
  },
];

const DERMAT_DATA = [
  {
    id: 1,
    name: "Dr. Orlando Diggs",
    qualifications: "MD Dermatology",
    experience: "10 Years Experience",
    details: "Specialist in Acne & Scars",
    price: "₹100",
    duration: "15 mins",
  },
  {
    id: 2,
    name: "Dr. Sarah Chen",
    qualifications: "MD, FAAD",
    experience: "8 Years Experience",
    details: "Pediatric Dermatology",
    price: "₹150",
    duration: "20 mins",
  },
  {
    id: 3,
    name: "Dr. Ananya Gupta",
    qualifications: "MBBS, DDVL",
    experience: "12 Years Experience",
    details: "Anti-aging & Aesthetics",
    price: "₹200",
    duration: "15 mins",
  },
];

const INFLUENCER_DATA = [
  {
    id: 1,
    name: "Sophie Moore",
    subtitle:
      "Let's chat about overcoming cystic acne and finding the right routine.",
    price: "₹50",
    duration: "15 mins",
  },
  {
    id: 2,
    name: "Alex Rivera",
    subtitle:
      "Skincare junkie sharing tips on hydration and glass skin secrets.",
    price: "₹75",
    duration: "20 mins",
  },
  {
    id: 3,
    name: "Jordan Lee",
    subtitle:
      "Real talk on sensitive skin, product fails, and budget-friendly finds.",
    price: "₹60",
    duration: "15 mins",
  },
];

const Page = () => {
  const [showToast, setShowToast] = useState(false);

  const handleNotifyClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen w-full font-sans overflow-x-hidden">
      {/* ================= HERO SECTION WRAPPER ================= */}
      {/* Gradient applied here specifically so it fades from Purple to White properly */}
      <div className="relative w-full bg-gradient-to-b from-[#A666F8] via-[#CFABF5] to-white pb-2 md:pb-20 overflow-x-hidden">
        {/* Keeping your provided Hero Section Code EXACTLY as is */}
        <div className="relative max-w-[1440px] mx-auto min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-10 px-4">
          {/* ================= FLOATING SVGs (SCALED UP) ================= */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top Left - SPF Tube */}
            <div
              className="absolute left-[5%] lg:left-[10%] top-[8%] w-16 sm:w-24 lg:w-52 drop-float"
              style={
                {
                  "--rotation": "12deg",
                  "--drop-delay": "0s",
                } as React.CSSProperties
              }
            >
              <Image
                src={landing1}
                alt="SPF"
                className="w-full h-auto drop-shadow-md"
                priority
              />
            </div>
            {/* Middle Left - Dropper Bottle */}
            <div
              className="absolute left-[2%] lg:left-[4%] top-[38%] w-14 sm:w-20 lg:w-44 drop-float"
              style={
                {
                  "--rotation": "-12deg",
                  "--drop-delay": "0.2s",
                } as React.CSSProperties
              }
            >
              <Image
                src={landing2}
                alt="Serum"
                className="w-full h-auto drop-shadow-md"
                priority
              />
            </div>
            {/* Bottom Left - Pump Bottle */}
            <div
              className="absolute left-[8%] lg:left-[15%] bottom-[20%] w-16 sm:w-22 lg:w-48 drop-float"
              style={
                {
                  "--rotation": "6deg",
                  "--drop-delay": "0.4s",
                } as React.CSSProperties
              }
            >
              <Image
                src={landing3}
                alt="Cleanser"
                className="w-full h-auto drop-shadow-md"
                priority
              />
            </div>
            {/* Top Right - Toner Bottle */}
            <div
              className="absolute right-[5%] lg:right-[12%] top-[12%] w-20 sm:w-28 lg:w-60 drop-float"
              style={
                {
                  "--rotation": "-6deg",
                  "--drop-delay": "0.1s",
                } as React.CSSProperties
              }
            >
              <Image
                src={landing4}
                alt="Toner"
                className="w-full h-auto drop-shadow-md"
                priority
              />
            </div>
            {/* Middle Right - Jar */}
            <div
              className="absolute right-[1%] lg:right-[2%] top-[40%] w-16 sm:w-22 lg:w-48 drop-float"
              style={
                {
                  "--rotation": "12deg",
                  "--drop-delay": "0.3s",
                } as React.CSSProperties
              }
            >
              <Image
                src={landing5}
                alt="Cream"
                className="w-full h-auto drop-shadow-md"
                priority
              />
            </div>
            {/* Bottom Right - Sheet Mask */}
            <div
              className="absolute right-[8%] lg:right-[15%] bottom-[22%] w-14 sm:w-20 lg:w-[187px] drop-float"
              style={
                {
                  "--rotation": "-12deg",
                  "--drop-delay": "0.5s",
                } as React.CSSProperties
              }
            >
              <Image
                src={landing6}
                alt="Sheet Mask"
                className="w-full h-auto drop-shadow-md"
                priority
              />
            </div>
          </div>

          {/* ================= CENTERED TEXT CONTENT ================= */}
          <div className="relative z-10 text-center max-w-3xl px-6 mt-8 md:mt-16 mb-0 md:mb-24">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black mb-5 md:mb-6 leading-tight animate-appear delay-300">
              Skincare, built for
              <br />
              <span className="italic font-serif ml-2 md:ml-3">Your</span> skin
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-800 leading-relaxed max-w-2xl mx-auto animate-appear delay-600 px-2">
              Take our quick quiz, discover what your skin really needs, and
              talk to experts & creators for real, no-BS advice.
            </p>
          </div>

          {/* ================= STATS SECTION ================= */}
          <div className="relative z-10 w-full max-w-[900px] px-2 animate-appear delay-900 hidden lg:block">
            <div className="bg-white/40 backdrop-blur-md border border-purple-200/50 rounded-[50px] shadow-sm py-1 px-2">
              <StatsGroup />
            </div>
          </div>
        </div>
      </div>

      {/* ================= NEW SECTION: START BUILDING YOUR ROUTINE ================= */}
      <div className="w-full bg-white pt-4 pb-12 md:py-12 md:pb-24 px-4 relative z-20 overflow-x-hidden">
        {/* FIX: Changed max-w-7xl to max-w-[1200px] to perfectly align with the StatsGroup above */}
        <div className="max-w-[1200px] mx-auto">
          {/* HEADER & NAV PILLS */}
          <div className="text-center mb-2 md:mb-10 px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-3 md:mb-8 px-2">
              Start Building Your Skincare Routine
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => scrollToSection("quiz-section")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full bg-[#FFAD71] text-white cursor-pointer hover:brightness-95 font-bold text-base sm:text-lg hover:shadow-lg transition-all active:scale-95 border-2 border-transparent"
              >
                Build My Routine
              </button>
              <button
                onClick={() => scrollToSection("dermat-section")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full bg-[#42C0A1] text-white cursor-pointer hover:brightness-95 font-bold text-base sm:text-lg hover:shadow-lg transition-all active:scale-95 border-2 border-transparent"
              >
                Get Clinical Skin Advice
              </button>
              <button
                onClick={() => scrollToSection("influencer-section")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full bg-[#B34B87] text-white cursor-pointer hover:brightness-95 font-bold text-base sm:text-lg hover:shadow-lg transition-all active:scale-95 border-2 border-transparent"
              >
                Ask a Skin Bestie
              </button>
            </div>
          </div>

          {/* 1. QUIZ SECTION (Left Dotted Line) */}
          <section
            id="quiz-section"
            className="py-8 md:py-12 scroll-mt-20 border-b border-gray-100 last:border-0"
          >
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-12 lg:gap-16">
              {/* Text Left */}
              <div className="flex-1 max-w-lg space-y-6 text-center md:text-left w-full">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight px-2 md:px-0">
                  Not Sure What Suits Your Skin? Let&apos;s Fix That!
                </h3>
                {/* Timeline List */}
                <div className="relative pl-8 border-l-2 border-dashed border-gray-300 space-y-8 text-left max-w-md mx-auto md:mx-0">
                  <div className="relative pl-2">
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full bg-[#FFAD71] ring-4 ring-white"
                      style={{ left: "-2rem", transform: "translateX(-50%)" }}
                    ></span>
                    <p className="text-lg font-medium text-black">
                      Take a quick skin quiz.
                    </p>
                  </div>
                  <div className="relative pl-2">
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full bg-[#FFAD71] ring-4 ring-white"
                      style={{ left: "-2rem", transform: "translateX(-50%)" }}
                    ></span>
                    <p className="text-lg font-medium text-black">
                      Get matched with dermat-backed products and a personalized
                      AM/PM routine.
                    </p>
                  </div>
                  <div className="relative pl-2">
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full bg-[#FFAD71] ring-4 ring-white"
                      style={{ left: "-2rem", transform: "translateX(-50%)" }}
                    ></span>
                    <p className="text-lg font-medium text-black">
                      Compare prices across Amazon, Flipkart, and Nykaa.
                    </p>
                  </div>
                </div>
                <div className="pt-2 flex justify-center md:justify-start">
                  <Link href="/quiz">
                    <button className="px-6 sm:px-8 py-3 rounded-xl bg-[#FFAD71] text-black font-bold text-base sm:text-lg hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
                      Take the Quiz <span className="text-xl">📝</span>
                    </button>
                  </Link>
                </div>
              </div>
              {/* Stack Right */}
              <div className="flex-1 flex justify-center items-center w-full">
                <MCQStack questions={QUESTIONS_DATA} />
              </div>
            </div>
          </section>

          {/* 2. DERMAT SECTION (Right Dotted Line) */}
          <section
            id="dermat-section"
            className="py-8 md:py-12 scroll-mt-20 border-b border-gray-100 last:border-0"
          >
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
              {/* Stack Left */}
              <div className="flex-1 flex justify-center w-full px-2 md:px-0">
                <DermatCardStack cards={DERMAT_DATA} />
              </div>
              {/* Text Right */}
              <div className="flex-1 max-w-lg space-y-6 text-center md:text-right w-full ml-0 md:ml-8">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight px-2 md:px-0">
                  Get Expert Help for Your Skin Concerns
                </h3>
                {/* Timeline List */}
                <div className="relative pr-6 border-r-2 border-dashed border-gray-300 space-y-8 flex flex-col items-center md:items-end text-left md:text-right max-w-md mx-auto md:mx-0 ml-8 md:ml-12">
                  <div className="relative text-right">
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full bg-[#42C0A1] ring-4 ring-white"
                      style={{ right: "-1.5rem", transform: "translateX(50%)" }}
                    ></span>
                    <p className="text-lg font-medium text-black">
                      Upload your skin photos and share your concerns.
                    </p>
                  </div>
                  <div className="relative text-right pr-2">
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full bg-[#42C0A1] ring-4 ring-white"
                      style={{ right: "-1.5rem", transform: "translateX(50%)" }}
                    ></span>
                    <p className="text-lg font-medium text-black">
                      Book a slot based on expert availability.
                    </p>
                  </div>
                  <div className="relative text-right pr-2">
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full bg-[#42C0A1] ring-4 ring-white"
                      style={{ right: "-1.5rem", transform: "translateX(50%)" }}
                    ></span>
                    <p className="text-lg font-medium text-black">
                      Get personalized, clinically backed guidance from
                      certified dermatologists.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center md:justify-end pt-2">
                  <Link href="/dermat">
                    <button className="px-4 sm:px-6 py-3 rounded-xl cursor-pointer bg-[#98E6D0] border border-[#42C0A1] text-black font-bold text-base sm:text-lg hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
                      <span className="text-xl">📅</span> Book Video
                      Consultation
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 3. INFLUENCER SECTION */}
          <section
            id="influencer-section"
            className="py-8 md:py-12 scroll-mt-20"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
              {/* Text Left */}
              <div className="flex-1 max-w-lg space-y-6 text-center md:text-left w-full">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight px-2 md:px-0">
                  Connect with People on a Similar Skincare Journey
                </h3>
                <div className="space-y-4 text-gray-800 text-base sm:text-lg font-medium leading-relaxed px-2 md:px-0">
                  <p>
                    Skincare Besties are skincare creators on the internet
                    who&apos;ve tried products, made mistakes, and learned what
                    truly works.
                  </p>
                  <p>
                    Talk with them for honest product experiences, real-life
                    reviews, and help building routines that match your skin
                    type, budget, lifestyle and the insights you won’t find on
                    labels.
                  </p>
                  <p>
                    This is peer-to-peer, experience-based learning to help you
                    make smarter choices and avoid common skincare mistakes.
                  </p>
                  <p>
                    Shared insights are based on personal experiences and meant
                    for learning and discovery.
                  </p>
                </div>
                <div className="pt-2 flex justify-center md:justify-start px-2 md:px-0">
                  <Link href="/booking">
                    <button className="px-6 sm:px-8 py-3 cursor-pointer rounded-xl bg-[#D489B3] text-white font-bold text-base sm:text-lg hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
                      Talk To Them Now <span className="text-xl">📹</span>
                    </button>
                  </Link>
                </div>
              </div>
              {/* Stack Right */}
              <div className="flex-1 flex justify-center w-full px-2 md:px-0">
                <InfluencerCardStack cards={INFLUENCER_DATA} />
              </div>
            </div>
          </section>

          <div className="mb-8">
            <ComingSoonMarquee />
          </div>

          {/* ================= COMING SOON CARDS ================= */}
          <div className="py-5 w-full max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {/* Card 1: Skyn Community */}
              <div className="bg-white rounded-[24px] shadow-[0_4px_16px_rgb(0,0,0,0.07)] border-8 border-gray-200 p-5 md:p-6 flex flex-col items-center h-full min-h-[320px] w-full max-w-md mx-auto md:max-w-none">
                <h3 className="text-lg md:text-2xl font-bold text-black mb-2">
                  Skyn Community
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6 flex-1 w-full">
                  <div className="shrink-0 relative w-40 h-40 flex items-center justify-center md:w-36 md:h-36">
                    <Image
                      src={coming_soon1}
                      alt="Community"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-700 text-md font-medium text-center md:text-left leading-relaxed w-full md:w-auto">
                    Discuss skincare across cultures, from K-Beauty and Indian
                    homecare to Japanese, Moroccan, and more.
                  </p>
                </div>
                <button
                  onClick={handleNotifyClick}
                  className="px-8 py-2 rounded-full bg-[#DABCFC] text-black font-semibold text-base hover:shadow-md transition-transform active:scale-95 mt-auto w-full md:w-auto"
                >
                  Notify Me
                </button>
              </div>
              {/* Card 2: Explore Products */}
              <div className="bg-white rounded-[24px] shadow-[0_4px_16px_rgb(0,0,0,0.07)] border-8 border-gray-200 p-5 md:p-6 flex flex-col items-center h-full min-h-[320px] w-full max-w-md mx-auto md:max-w-none">
                <h3 className="text-lg md:text-2xl font-bold text-black mb-2">
                  Explore Products
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6 flex-1 w-full">
                  <div className="shrink-0 relative w-40 h-40 flex items-center justify-center md:w-36 md:h-36">
                    <Image
                      src={coming_soon2}
                      alt="Products"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-700 text-md font-medium text-center md:text-left leading-relaxed w-full md:w-auto">
                    Discover dermatologist-formulated skincare brands, delivered
                    to your doorstep.
                  </p>
                </div>
                <button
                  onClick={handleNotifyClick}
                  className="px-8 py-2 rounded-full bg-[#FECFBB] text-black font-semibold text-base hover:shadow-md transition-transform active:scale-95 mt-auto w-full md:w-auto"
                >
                  Notify Me
                </button>
              </div>
            </div>
          </div>

          {/* ================= FINAL CTA CARD ================= */}
          <div className="mt-12 md:mt-20 mb-10 w-full flex justify-center px-4">
            {/* FIX: Removed conflicting 'border' class. Updated to 'border-8 border-gray-100' to be cleaner/aligned. */}
            <div className="w-full max-w-5xl bg-white rounded-[24px] md:rounded-[40px] border-4 md:border-8 border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 sm:p-8 md:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-4 md:mb-6">
                Start Building Your Skincare Routine
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6 md:mb-10 leading-relaxed">
                Not sure what suits your skin? Take our quiz for dermat-backed
                products, or get real guidance from certified experts and
                skincare creators.
                <br className="hidden sm:block" />
                All in One Place!
              </p>
              <button
                onClick={() => scrollToSection("quiz-section")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 md:py-4 rounded-xl bg-[#FFAD71] text-black font-bold text-base sm:text-lg hover:shadow-lg transition-all active:scale-95 border-2 border-black/5"
              >
                Start Building My Skincare Routine
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">
              You'll be notified about future updates!
            </span>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
