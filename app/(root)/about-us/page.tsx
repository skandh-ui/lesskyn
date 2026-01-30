import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link to keep it a Server Component

// Decorative Background Imports
import pinkBottle from "@/public/assets/pinkBottle.svg";
import yelo from "@/public/assets/yelo.svg"; // Yellow blob
import orange from "@/public/assets/orangeCine.svg";
import yellowBottle from "@/public/assets/yellobottle.svg";
import blueB from "@/public/assets/bluebpot.svg";

// Main Shape Imports
import about_us_1 from "@/public/assets/about_us_1.svg"; 
import about_us_2 from "@/public/assets/about_us_2.svg"; 
import about_us_3 from "@/public/assets/about_us_3.svg"; 
import about_us_4 from "@/public/assets/about_us_4.svg"; 

const Page = () => {
  return (
    <div className="relative min-h-screen bg-[#FFE4FA] overflow-hidden font-sans">
      {/* ==========================================
          Background Decorative Elements (Absolute)
          ========================================== */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Top Left - Pink Bottle */}
        <div className="absolute top-10 left-5 md:left-20 w-12 md:w-16 opacity-80">
          <Image src={pinkBottle} alt="decoration" />
        </div>

        {/* Top Rightish - Yellow Blob 1 */}
        <div className="absolute top-8 right-1/4 w-10 md:w-14 rotate-12">
          <Image src={yelo} alt="decoration" />
        </div>

        {/* Top Right - Orange Cine */}
        <div className="absolute top-20 right-5 md:right-16 w-12 md:w-16">
          <Image src={orange} alt="decoration" />
        </div>

        {/* Middle Left - Yellow Bottle */}
        <div className="absolute top-[40%] left-2 md:left-10 w-10 md:w-14">
          <Image src={yellowBottle} alt="decoration" />
        </div>

        {/* Lower Right (Near Influencer section) - Yellow Blob 2 */}
        <div className="absolute top-[65%] right-10 md:right-32 w-10 md:w-14 -rotate-12">
          <Image src={yelo} alt="decoration" />
        </div>

        {/* Bottom Right - Blue Pot */}
        <div className="absolute bottom-40 right-4 md:right-12 w-10 md:w-14">
          <Image src={blueB} alt="decoration" />
        </div>
      </div>

      {/* ==========================================
          Main Content Container
          ========================================== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        
        {/* Page Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-black mb-20">
          About Us
        </h1>

        {/* Grid Layout - Increased vertical space */}
        <div className="space-y-12">
          
          {/* --- Row 1: Two Columns (Increased Gap) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Card: The Skincare Chaos */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col justify-center h-full">
              <h2 className="text-2xl font-bold mb-6 text-black">The Skincare Chaos</h2>
              <div className="space-y-4 text-gray-800 font-medium leading-relaxed">
                <p>Skincare right now is honestly a lot.</p>
                <p>Too many products.<br/>Too many opinions.</p>
                <p>Routines keep getting longer, yet your skin still isn't skinning.</p>
                <p>It's giving <span className="font-bold">confusion</span>, not clarity.</p>
              </div>
            </div>

            {/* Card: Meet LesSkyn */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col justify-center h-full">
              <h2 className="text-2xl font-bold mb-6 italic font-serif text-black">Meet LesSkyn</h2>
              <div className="space-y-4 text-gray-800 font-medium leading-relaxed">
                <p className="italic text-gray-600">LesSkyn exists to fix that.</p>
                <p>We're an AI-powered skincare platform that helps you understand your skin before you treat it.</p>
                <p>No trend-chasing. No random trial and error.</p>
                <p>Just personalised skincare that actually makes sense for you. We focus on what works, not what's viral.</p>
              </div>
            </div>
          </div>

          {/* --- Row 2: Ingredient Approach (Full Width) --- */}
          <div className="bg-white rounded-[32px] p-8 md:p-16 shadow-sm text-center">
            <h2 className="text-2xl font-bold mb-4 text-black">Ingredient-First Approach</h2>
            <p className="text-gray-600 font-medium mb-12">
              At LesSkyn, everything starts with ingredients.<br/>We break down:
            </p>

            {/* The 4 SVGs with Text Overlay */}
            <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 mb-12">
              
              <div className="relative w-40 h-24 md:w-48 md:h-28 flex items-center justify-center">
                <Image src={about_us_1} alt="Shape 1" fill className="object-contain" />
                <span className="relative z-10 text-xs md:text-sm font-bold text-black px-2">
                  What each ingredient does
                </span>
              </div>

              <div className="relative w-40 h-24 md:w-48 md:h-28 flex items-center justify-center">
                <Image src={about_us_2} alt="Shape 2" fill className="object-contain" />
                <span className="relative z-10 text-xs md:text-sm font-bold text-black px-2">
                  When to use it
                </span>
              </div>

              <div className="relative w-40 h-24 md:w-48 md:h-28 flex items-center justify-center">
                <Image src={about_us_3} alt="Shape 3" fill className="object-contain" />
                <span className="relative z-10 text-xs md:text-sm font-bold text-black px-2">
                  Who it's for
                </span>
              </div>

              <div className="relative w-40 h-24 md:w-48 md:h-28 flex items-center justify-center">
                <Image src={about_us_4} alt="Shape 4" fill className="object-contain" />
                <span className="relative z-10 text-xs md:text-sm font-bold text-black px-2">
                  What not to mix
                </span>
              </div>

            </div>

            <p className="text-sm md:text-base italic text-gray-500 font-medium">
              Because knowing why something works hits different than blindly copying a routine.
            </p>
          </div>

          {/* --- Row 3: Two Columns (Increased Gap) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Card: Personalised Routines */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col items-center text-center h-full">
              <h2 className="text-2xl font-bold mb-6 text-black">Personalised Routines</h2>
              <p className="text-gray-700 mb-6 font-medium">
                Take a quick AI-powered quiz, and we build a custom AM/PM routine based on your:
              </p>
              
              {/* Green Pills Mockup */}
              <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-sm">
                <div className="bg-[#B6F5D9] rounded-full py-2 px-3 text-xs md:text-sm font-semibold text-black border border-black/5">Skin type</div>
                <div className="bg-[#B6F5D9] rounded-full py-2 px-3 text-xs md:text-sm font-semibold text-black border border-black/5">Preference</div>
                <div className="bg-[#B6F5D9] rounded-full py-2 px-3 text-xs md:text-sm font-semibold text-black border border-black/5">Commitment Level</div>
                <div className="bg-[#B6F5D9] rounded-full py-2 px-3 text-xs md:text-sm font-semibold text-black border border-black/5">Concerns</div>
              </div>

              <div className="text-gray-800 font-medium mt-auto">
                <p className="mb-2">No unnecessary steps. No 10-product pressure.</p>
                <p>Just a routine you'll actually stick to.</p>
              </div>
            </div>

            {/* Card: Talk to Real Influencers */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col items-center text-center justify-center h-full">
              <h2 className="text-2xl font-bold mb-6 text-black">Talk to Real Influencers</h2>
              
              <div className="space-y-6 text-gray-800 font-medium">
                <p>Sometimes AI isn't enough.<br/>We get it.</p>
                <p>With LesSkyn, you can book 1-on-1 video calls with skincare influencers you genuinely trust.</p>
                <p className="text-sm">
                  Not scripted brand talk. Not paid pushes. Just honest skin journeys, real experiences, and advice that actually helps.
                </p>
              </div>
            </div>
          </div>

          {/* --- Row 4: Mission Statement --- */}
          <div className="bg-white rounded-[32px] p-10 md:p-14 shadow-sm text-center">
            <p className="text-lg text-gray-800 font-medium mb-8">
              LesSkyn isn't about instant results.
            </p>
            <p className="text-xl md:text-2xl font-bold italic text-black mb-10 leading-relaxed">
              It's about consistency, understanding your skin, and building habits that last. The glow will follow. Periodt!
            </p>
            <p className="text-base md:text-lg font-medium text-gray-600">
              Your skin is unique. Your skincare should be too.
            </p>
          </div>

        </div>

        {/* ==========================================
            New Footer Section: Welcome & Get Started
            ========================================== */}
        <div className="mt-24 text-center pb-10">
          <h2 className="text-4xl md:text-5xl italic font-normal text-black mb-8 font-sans">
            Welcome to LesSkyn
          </h2>
          
          {/* Using Next.js Link acts as a button but keeps the page server-side */}
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