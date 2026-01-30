"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import MCQ from "@/components/MCQ";

interface QuestionData {
  id: number;
  question: string;
  options: string[];
}

interface MCQStackProps {
  questions?: QuestionData[];
  autoPlayInterval?: number;
}

const DEFAULT_QUESTIONS: QuestionData[] = [
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

const MCQStack: React.FC<MCQStackProps> = ({
  questions = DEFAULT_QUESTIONS,
  autoPlayInterval = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % questions.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [questions.length, autoPlayInterval]);

  const getVariantState = (index: number) => {
    const total = questions.length;
    const offset = (index - activeIndex + total) % total;

    if (offset === 0) return "front";
    if (offset === 1) return "back1";
    if (offset === 2) return "back2";
    if (offset === total - 1) return "exit";
    return "hidden";
  };

  // --- ANIMATION VARIANTS (FIXED CLICK ISSUE) ---
  const variants = {
    front: {
      zIndex: 30,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      filter: "brightness(1)",
      pointerEvents: "auto" as const, // Enable clicks on the front card
      transition: { duration: 0.6, ease: "circOut" },
    },
    back1: {
      zIndex: 20,
      x: -30,
      y: 0,
      scale: 0.94,
      opacity: 1,
      filter: "brightness(0.95)",
      pointerEvents: "none" as const, // Disable clicks
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    back2: {
      zIndex: 10,
      x: -60,
      y: 0,
      scale: 0.88,
      opacity: 0.8,
      filter: "brightness(0.9)",
      pointerEvents: "none" as const, // Disable clicks
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: {
      zIndex: 40, // High z-index, but...
      x: 80,
      y: 0,
      scale: 1.15,
      opacity: 0,
      filter: "brightness(1)",
      pointerEvents: "none" as const, // ...CLICKS DISABLED so it doesn't block the front card
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hidden: {
      zIndex: 0,
      x: -60,
      y: 0,
      scale: 0.88,
      opacity: 0,
      pointerEvents: "none" as const,
      transition: { duration: 0 },
    },
  };

  return (
    // Responsive width: smaller on mobile, full size on desktop
    <div className="relative flex items-center justify-center w-[280px] sm:w-[380px] md:w-[480px] h-[400px] sm:h-[500px] md:h-[600px] mx-auto">
      {questions.map((item, index) => (
        <motion.div
          key={item.id}
          className="absolute top-0 origin-center"
          initial="hidden"
          animate={getVariantState(index)}
          variants={variants}
        >
          <MCQ
            question={item.question}
            options={item.options}
            currentStep={index + 1}
            totalSteps={questions.length}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MCQStack;
