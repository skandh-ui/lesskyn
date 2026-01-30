"use client";

import React, { useState, useEffect } from "react";
import ProductCarousel from "@/components/ProductCarousel";

interface ProductData {
  name: string;
  pictureLink: string;
  amazon: {
    link: string;
    price: number;
  };
}

interface ProductStepGroup {
  step: number;
  label: string;
  products: Array<{
    name: string;
    pictureLink?: string;
    amazon?: {
      link: string;
      price?: number;
    };
  }>;
}

interface RoutineData {
  AM_Routine: ProductStepGroup[];
  PM_Routine: ProductStepGroup[];
  Weekly_Routine: ProductStepGroup[];
}

export default function SkincarePortfolioPage() {
  const [activeTab, setActiveTab] = useState<"AM" | "PM" | "Weekly">("AM");
  const [routineData, setRoutineData] = useState<RoutineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get quiz answers from localStorage
        const commitment = localStorage.getItem("quiz_commitment");
        const skinType = localStorage.getItem("quiz_skinType");
        const concern = localStorage.getItem("quiz_concern");
        const preference = localStorage.getItem("quiz_preference");

        console.log("Quiz data from localStorage:", {
          commitment,
          skinType,
          concern,
          preference,
        });

        if (!commitment || !skinType || !concern || !preference) {
          setError("Quiz data not found. Please complete the quiz first.");
          setLoading(false);
          return;
        }

        const requestBody = {
          commitment,
          skinType,
          concern,
          preference,
        };

        console.log("Sending to API:", requestBody);

        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data = await response.json();
        console.log("API Response:", data);
        setRoutineData(data.products);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper to transform product data for carousel
  const transformProducts = (
    products: Array<{
      name: string;
      pictureLink?: string;
      amazon?: { link: string; price?: number };
    }>,
  ): ProductData[] => {
    return products
      .filter(
        (product) =>
          product.name && product.pictureLink && product.amazon?.link,
      )
      .map((product) => ({
        name: product.name,
        pictureLink: product.pictureLink!,
        amazon: {
          link: product.amazon!.link,
          price: product.amazon!.price || 0,
        },
      }));
  };

  // Helper to determine active data (returns step groups, not flattened products)
  const getCurrentSteps = (): ProductStepGroup[] => {
    if (!routineData) return [];

    switch (activeTab) {
      case "PM":
        return routineData.PM_Routine;
      case "Weekly":
        return routineData.Weekly_Routine;
      case "AM":
      default:
        return routineData.AM_Routine;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading your personalized skincare routine...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/quiz?step=1" className="text-blue-600 hover:underline">
            Go back to quiz
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      {/* 1. Top Gradient Section 
        Gradient from #E1D0F7 to white.
      */}
      <div className="w-full bg-gradient-to-b from-[#E1D0F7] to-[#ffffff] pt-16 pb-8 px-6 text-center">
        <h1 className="font-serif text-3xl md:text-5xl text-gray-900 mb-3">
          Your Skincare Portfolio
        </h1>
        <p className="text-gray-600 text-lg font-light tracking-wide">
          Curated products for your skin type & goals
        </p>

        {/* Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 md:gap-8">
          {["AM Routine", "PM Routine", "Weekly Routine"].map((tabLabel) => {
            const tabKey = tabLabel.split(" ")[0] as "AM" | "PM" | "Weekly";
            const isActive = activeTab === tabKey;

            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`min-w-[140px] rounded-lg border px-6 py-3 text-lg font-medium transition-colors duration-200
                  ${
                    isActive
                      ? "border-[#FCFCA2] bg-[#FCFCA2] text-black shadow-sm" // Active State
                      : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50" // Inactive State
                  }
                `}
              >
                {tabLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Content Section
       */}
      <div className="mx-auto max-w-7xl px-6 pb-20 mt-8">
        {/* Display each step as a separate section with its own carousel */}
        {getCurrentSteps().map((step, index) => {
          const stepProducts = transformProducts(step.products);

          // Skip if no valid products in this step
          if (stepProducts.length === 0) return null;

          return (
            <div key={step.step || index} className="mb-12">
              {/* Step Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Step {step.step}: {step.label}
                </h2>
              </div>

              {/* Product Carousel for this step */}
              <ProductCarousel products={stepProducts} />
            </div>
          );
        })}

        {/* Show message if no products */}
        {getCurrentSteps().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found for this routine.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
