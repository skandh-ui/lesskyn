"use client"
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const loadingSteps = [
  "Searching for your personalized routine...",
  "AI is still crafting your perfect skincare plan...",
  "Analyzing thousands of product combinations...",
  "Fine-tuning morning and evening routines...",
  "Adding finishing touches to your regimen...",
  "Almost ready - finalizing recommendations...",
  "Your routine is being saved securely...",
];

interface AnimatedLoadingScreenProps {
  onComplete?: () => void;
  autoAdvanceDelay?: number;
}

const AnimatedLoadingScreen = ({ 
  onComplete, 
  autoAdvanceDelay = 1200 
}: AnimatedLoadingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= loadingSteps.length) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, autoAdvanceDelay);

    return () => clearTimeout(timer);
  }, [currentStep, autoAdvanceDelay, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">

      {/* Correct gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0433] via-[#47126B] to-[#FE639C]" />

      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        
        {/* Animated Steps */}
        <div className="flex flex-col gap-4 px-6">
          {loadingSteps.map((step, index) => {
            if (index > currentStep) return null; // <-- KEY FIX: show only up to current step

            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 transition-all duration-500`}
              >
                {/* Icon */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-purple text-white"
                      : isCurrent
                      ? "border-2 border-purple animate-pulse"
                      : "border-2 border-purple/30"
                  }`}
                >
                  {isCompleted && <Check className="w-4 h-4" />}
                </div>

                {/* Text */}
                <span
                  className="font-sans text-sm md:text-base text-white/90 animate-fadeIn"
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimatedLoadingScreen;