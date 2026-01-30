"use client";

import React, { useEffect, useRef, useState } from "react";

// Define the available variants
type VariantType = "green" | "pink";

interface StepProcessProps {
  variant: VariantType;
  steps: string[];
}

const StepProcess: React.FC<StepProcessProps> = ({ variant, steps }) => {
  // State to track if the component is in view
  const [isVisible, setIsVisible] = useState(false);
  // Ref to attach to the container element
  const containerRef = useRef<HTMLDivElement>(null);

  const isGreen = variant === "green";

  const greenConfig = {
    bgColor: "#3CBF97",
    shapeClass: "rounded-full",
  };

  const pinkConfig = {
    bgColor: "#B4417D",
    shapeClass: "rounded-md",
  };

  const config = isGreen ? greenConfig : pinkConfig;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the element is in the viewport, trigger the animation
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: Stop observing once triggered so it doesn't replay when scrolling up/down
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the component is visible
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col md:flex-row gap-6 md:gap-12 justify-between max-w-5xl mx-auto py-4 md:py-6 px-4"
    >
      {steps.map((stepText, index) => {
        // Determine delay class based on index
        const delayClass =
          index === 1 ? "delay-300" : index === 2 ? "delay-600" : "";

        return (
          <div
            key={index}
            className={`flex items-start gap-3 md:gap-5 flex-1 ${
              isVisible ? `animate-appear ${delayClass}` : "opacity-0"
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 md:w-14 md:h-14 text-white text-xl md:text-3xl font-bold shrink-0 shadow-sm ${config.shapeClass}`}
              style={{ backgroundColor: config.bgColor }}
            >
              {index + 1}
            </div>

            {/* The Text Description */}
            <p className="text-base md:text-xl text-gray-800 leading-snug font-medium">
              {stepText}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StepProcess;
