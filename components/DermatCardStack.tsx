"use client";

import React, { useState, useEffect } from "react";
// UPDATED IMPORT for Motion v12+
import { motion } from "motion/react";
import DermatCard from "@/components/DermatCard";

interface DoctorData {
  id: number;
  name: string;
  qualifications: string;
  experience: string;
  details: string;
  price: string;
  duration: string;
  avatar?: string;
}

interface DermatCardStackProps {
  cards: DoctorData[];
  autoPlayInterval?: number;
}

const DermatCardStack: React.FC<DermatCardStackProps> = ({
  cards,
  autoPlayInterval = 3500,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [cards.length, autoPlayInterval]);

  // Helper to determine the state of each card
  const getVariantState = (index: number) => {
    const total = cards.length;

    // Calculate relative position based on the active index
    // 0 = Active Card
    // 1 = Next card (behind)
    // 2 = Last card (further behind)
    // total - 1 = The card that just left (Exit animation)
    const offset = (index - activeIndex + total) % total;

    if (offset === 0) return "front";
    if (offset === 1) return "back1";
    if (offset === 2) return "back2";
    if (offset === total - 1) return "exit";
    return "hidden";
  };

  // Animation Variants
  const variants = {
    front: {
      zIndex: 30,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      filter: "brightness(1)",
      transition: { duration: 0.6, ease: "circOut" },
    },
    back1: {
      zIndex: 20,
      x: -30, // Stacked to the LEFT
      y: 0, // Kept aligned vertically
      scale: 0.94,
      opacity: 1,
      filter: "brightness(0.95)",
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    back2: {
      zIndex: 10,
      x: -60, // Further LEFT
      y: 0,
      scale: 0.88,
      opacity: 0.8,
      filter: "brightness(0.9)",
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: {
      zIndex: 40, // Stays on top while exiting
      x: 80, // Moves slightly RIGHT
      y: 0,
      scale: 1.15, // EXPANDS
      opacity: 0, // FADES away
      filter: "brightness(1)",
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hidden: {
      zIndex: 0,
      x: -60, // Teleport to back of the stack
      y: 0,
      scale: 0.88,
      opacity: 0,
      transition: { duration: 0 }, // Instant reset
    },
  };

  return (
    // Container centered - responsive
    <div className="relative flex items-center justify-center w-[280px] sm:w-[320px] md:w-[350px] h-[450px] sm:h-[500px] md:h-[550px] mx-auto">
      {cards.map((doctor, index) => (
        <motion.div
          key={doctor.id}
          className="absolute top-0 origin-center"
          initial="hidden"
          animate={getVariantState(index)}
          variants={variants}
        >
          <DermatCard
            name={doctor.name}
            qualifications={doctor.qualifications}
            experience={doctor.experience}
            details={doctor.details}
            price={doctor.price}
            duration={doctor.duration}
            avatar={doctor.avatar}
            size="compact"
            className="md:scale-100 scale-75 origin-top"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default DermatCardStack;
