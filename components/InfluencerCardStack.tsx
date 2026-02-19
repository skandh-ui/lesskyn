"use client";

import React, { useState, useEffect } from "react";
// Using Motion v12+ import
import { motion } from "motion/react";
import InfluencerCard from "@/components/InfluencerCard";

// Define data interface matching InfluencerCard props
interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

interface InfluencerData {
  id: number;
  expertId: string;
  name: string;
  subtitle: string;
  price: string;
  duration: string;
  avatar?: string;
  socials?: SocialLinks;
}

interface InfluencerCardStackProps {
  cards: InfluencerData[];
  autoPlayInterval?: number;
}

const InfluencerCardStack: React.FC<InfluencerCardStackProps> = ({
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
    const offset = (index - activeIndex + total) % total;

    if (offset === 0) return "front";
    if (offset === 1) return "back1";
    if (offset === 2) return "back2";
    if (offset === total - 1) return "exit";
    return "hidden";
  };

  // Animation Variants (Same as DermatStack)
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
      y: 0,
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
      zIndex: 40,
      x: 80, // Moves slightly RIGHT
      y: 0,
      scale: 1.15, // EXPANDS
      opacity: 0, // FADES away
      filter: "brightness(1)",
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hidden: {
      zIndex: 0,
      x: -60, // Teleport to back
      y: 0,
      scale: 0.88,
      opacity: 0,
      transition: { duration: 0 }, // Instant reset
    },
  };

  return (
    // Container width responsive for mobile
    <div className="relative flex items-center justify-center w-[280px] sm:w-[320px] md:w-[380px] h-[450px] sm:h-[520px] md:h-[600px] mx-auto">
      {cards.map((influencer, index) => (
        <motion.div
          key={influencer.id}
          className="absolute top-0 origin-center"
          initial="hidden"
          animate={getVariantState(index)}
          variants={variants}
        >
          <InfluencerCard
            name={influencer.name}
            subtitle={influencer.subtitle}
            price={influencer.price}
            duration={influencer.duration}
            avatar={influencer.avatar}
            socials={influencer.socials}
            expertId={influencer.expertId}
            size="compact"
            className="md:scale-100 scale-75 origin-top"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default InfluencerCardStack;
