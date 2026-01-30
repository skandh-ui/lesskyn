"use client";

import React, { useState } from "react";

interface MCQProps {
  question?: string;
  options?: string[];
  currentStep?: number;
  totalSteps?: number;
}

const MCQ = ({
  question = "What is your main skin concern?",
  options = [
    "Acne & Breakouts",
    "Hyperpigmentation",
    "Aging & wrinkles",
    "Dark Spots",
  ],
  currentStep = 3,
  totalSteps = 4,
}: MCQProps) => {
  const [selected, setSelected] = useState<string | null>("Hyperpigmentation");

  const progress = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    // Responsive width: smaller on mobile, full size on desktop
    <div className="relative w-[280px] sm:w-[380px] md:w-[480px] overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[32px] bg-white shadow-xl border-4 sm:border-6 md:border-8 border-gray-100 flex flex-col">
      {/* Main Content */}
      <div className="relative z-20 p-4 sm:p-6 md:p-8 flex flex-col h-full">
        {/* Header: Step Count & Progress Bar */}
        <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 gap-3 sm:gap-4">
          <span className="text-gray-400 font-semibold text-xs sm:text-sm whitespace-nowrap">
            Question {currentStep} of {totalSteps}
          </span>
          {/* Progress Bar Track */}
          <div className="w-20 sm:w-24 h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden shrink-0">
            {/* Progress Fill (Blue) */}
            <div
              className="h-full bg-[#38CDF8] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-4 sm:mb-5 md:mb-6 leading-snug">
          {question}
        </h3>

        {/* Options List */}
        <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3 pb-3 sm:pb-4">
          {options.map((option, index) => {
            const isSelected = selected === option;
            return (
              <button
                key={index}
                onClick={() => setSelected(option)}
                className={`
                  relative z-20 w-full text-left py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200
                  font-medium text-sm sm:text-base md:text-[17px] cursor-pointer
                  ${
                    isSelected
                      ? "border-[#38CDF8] bg-[#E0F7FE] text-black shadow-sm"
                      : "border-gray-300 bg-white text-black hover:border-gray-400"
                  }
                `}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-22 bg-gradient-to-t from-[#FFAD71] via-[#FFAD71]/80 to-transparent pointer-events-none z-30" />
    </div>
  );
};

export default MCQ;
