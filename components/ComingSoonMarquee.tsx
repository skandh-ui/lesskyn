"use client";

import React from "react";

const ComingSoonMarquee = () => {
  const textItems = Array(10).fill("COMING SOON");

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden bg-[#FCFCA2] py-1 border-y-2 border-black">
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>

      <div className="flex w-max">
        {/* First set */}
        <div className="flex animate-scroll">
          {textItems.map((item, index) => (
            <div key={index} className="flex items-center mx-6">
              {/* Reduced text size slightly to match thinner bar */}
              <span className="text-xl md:text-2xl font-bold text-black font-serif tracking-wider">
                {item}
              </span>
              <span className="ml-6 text-lg text-black">✦</span>
            </div>
          ))}
        </div>

        {/* Duplicate set */}
        <div className="flex animate-scroll" aria-hidden="true">
          {textItems.map((item, index) => (
            <div key={`dup-${index}`} className="flex items-center mx-6">
              <span className="text-xl md:text-2xl font-bold text-black font-serif tracking-wider">
                {item}
              </span>
              <span className="ml-6 text-lg text-black">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonMarquee;