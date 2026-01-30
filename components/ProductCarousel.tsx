"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard"; // Adjust path if needed

// Reuse the interface from your ProductCard
interface ProductData {
  name: string;
  pictureLink: string;
  amazon: {
    link: string;
    price: number;
  };
}

interface ProductCarouselProps {
  products: ProductData[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const showArrows = products.length >= 4;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Approx width of one card + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow - Only show if 4 or more products */}
      {showArrows && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 shadow-md transition-transform hover:scale-110 hover:bg-gray-50 disabled:opacity-50 md:-left-8"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className={`flex gap-6 overflow-x-auto px-4 py-8 scroll-smooth ${
          !showArrows ? "justify-center" : ""
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, index) => (
          <div key={index} className="shrink-0">
            <ProductCard data={product} />
          </div>
        ))}
      </div>

      {/* Right Arrow - Only show if 4 or more products */}
      {showArrows && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 shadow-md transition-transform hover:scale-110 hover:bg-gray-50 md:-right-8"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default ProductCarousel;
