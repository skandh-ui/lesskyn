"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DermatCard from "@/components/DermatCard";
import StepProcess from "@/components/StepProcess";
import CustomButton from "@/components/CustomButton";
import FAQ from "@/components/FAQ";
import doctors from "@/public/assets/doctors.svg";

const faqData = [
  {
    question: "What does a dermatologist actually do?",
    answer:
      "A dermatologist is a medically trained doctor who diagnoses and treats skin, hair, and nail conditions using evidence-based care.",
  },
  {
    question: "When should you consider speaking to a dermatologist?",
    answer:
      "If your concern is persistent, painful, worsening, or not improving with OTC products, it’s time to consult a professional.",
  },
  {
    question: "What kinds of concerns can a dermatologist help with online?",
    answer:
      "Acne, pigmentation, hair fall, dandruff, eczema, rosacea, fungal infections, ageing concerns, and more.",
  },
  {
    question: "Does an online dermatologist consultation really work?",
    answer:
      "Most conditions are diagnosed visually and through history, making online consultations highly effective.",
  },
  {
    question: "How do dermatologists assess skin without a physical exam?",
    answer:
      "High-quality images, videos, and detailed symptom history allow accurate evaluation in most such cases.",
  },
  {
    question: "How reliable is an online dermatology diagnosis?",
    answer:
      "When done with clear visuals and proper medical history, accuracy is comparable to in-clinic consultations.",
  },
  {
    question: "How long does a typical dermat consultation take?",
    answer:
      "Usually 10–20 minutes, depending on the concern and follow-up questions.",
  },
  {
    question: "What should I do before my dermat appointment?",
    answer:
      "Upload clear photos, avoid makeup or filters, and share past treatments or products you’ve tried.",
  },
  {
    question: "Will I receive a prescription if needed?",
    answer:
      "Yes, dermatologists can issue valid digital prescriptions in compliance with medical guidelines. After your consultation, we will email you the prescription as well.",
  },
  {
    question: "Are the dermatologists verified medical professionals?",
    answer:
      "Yes, only licensed and qualified dermatologists are onboarded on the platform.",
  },
  {
    question: "Is an online dermat consultation legally valid in India?",
    answer:
      "Yes. Online consultations and e-prescriptions are permitted under Indian telemedicine guidelines.",
  },
  {
    question: "Why talk to a dermatologist instead of self-treating?",
    answer:
      "Because guessing can worsen skin issues. Dermatologists treat the root cause, not just symptoms.",
  },
  {
    question: "What are the advantages of consulting a dermatologist online?",
    answer:
      "Convenience, faster access, expert care, no clinic wait times, and evidence-based guidance.",
  },
  {
    question: "How affordable is a dermatologist consultation on LesSkyn?",
    answer:
      "Pricing is transparent and typically more affordable than in-clinic visits.",
  },
  {
    question: "How quickly can I connect with a dermatologist?",
    answer:
      "You can book and consult easily—often within hours, depending on availability.",
  },
];

const greenStepsData = [
  "Upload your skin photos and share your concerns.",
  "Book a slot based on expert availability.",
  "Get personalized, clinically backed guidance.",
];

const DermatPage = () => {
  const router = useRouter();
  const gridRef = useRef<HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dermatologists, setDermatologists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const itemsPerPage = 9;

  // Fetch dermatologists from API
  useEffect(() => {
    const fetchDermatologists = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/experts?type=dermatologist&page=${currentPage}&limit=${itemsPerPage}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dermatologists");
        }

        const data = await response.json();
        setDermatologists(data.experts || []);
        setPagination(
          data.pagination || {
            totalPages: 0,
            totalCount: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching dermatologists:", err);
        setError("Failed to load dermatologists. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDermatologists();
  }, [currentPage]);

  // Use dermatologists directly from API (no slicing needed)
  const currentDoctors = dermatologists.filter((doctor) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doctor.name?.toLowerCase().includes(query) ||
      doctor.degree?.toLowerCase().includes(query) ||
      doctor.specialization?.toLowerCase().includes(query) ||
      doctor.bio?.toLowerCase().includes(query)
    );
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full bg-gradient-to-b from-[#42c0a1] to-white pt-10 pb-0 md:pt-32 px-4">
        <div className="max-w-[1246px] mx-auto flex flex-col md:flex-row items-center md:items-center pb-0 md:min-h-[600px]">
          {/* Left Content */}
          <div className="flex-1 z-10 flex flex-col justify-center items-start space-y-8 md:pr-20 mb-12 md:mb-0">
            <h1 className="font-montserrat font-bold text-4xl md:text-[56px] leading-tight text-black max-w-2xl">
              Get <span className="italic font-serif">Expert</span> Help for
              Your Skin Concerns
            </h1>

            <div className="w-full max-w-md">
              <CustomButton
                variant="yellow"
                text="Book Video Consultation from 10+ Clinical Skin Experts"
              />
            </div>
          </div>

          {/* Right Image (Doctors) */}
          <div className="relative w-full md:w-[45%] flex items-end justify-center md:justify-end animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Adjusted image sizing for better responsiveness within the new full-width layout.
               Using 'w-auto h-auto mx-w-full' allows it to scale naturally.
            */}
            <Image
              src={doctors}
              alt="Clinical Experts"
              className="w-auto h-auto max-w-full md:max-w-none md:h-[600px] object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </div>

      {/* 2. STEPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 mb-20 mt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-black max-w-3xl mx-auto leading-snug">
          How To Get Clinically Backed Guidance From Certified Dermatologists
          And Qualified Aesthetic Experts?
        </h2>
        <StepProcess variant="green" steps={greenStepsData} />
      </section>

      {/* 3. GRID SECTION (3x3) */}
      <section ref={gridRef} className="bg-white pb-24">
        <div className="max-w-[1246px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-black">
            Choose From a Range of Qualified Experts
          </h2>

          {/* Search Box */}
          <div className="max-w-xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search by name, degree, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-lg border-2 border-gray-200 focus:border-[#42c0a1] focus:outline-none text-black placeholder-gray-400 transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42c0a1] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dermatologists...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-[#42c0a1] text-white rounded-lg hover:bg-[#3aae8f] transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : dermatologists.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <p className="text-gray-600">
                No dermatologists available at the moment.
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {currentDoctors.map((doctor) => (
                  <div key={doctor.id} className="flex justify-center">
                    <div className="cursor-pointer">
                      <DermatCard
                        name={doctor.name}
                        qualifications={doctor.degree || "Dermatologist"}
                        experience={
                          doctor.experienceYears
                            ? `${doctor.experienceYears} Years Experience`
                            : "Experienced"
                        }
                        details={
                          doctor.specialization ||
                          doctor.bio ||
                          "Skin Care Specialist"
                        }
                        price={`₹${doctor.price || 0}`}
                        duration={`${doctor.durations?.[0] || 30} mins`}
                        avatar={doctor.avatar}
                        socials={doctor.socials}
                        size="compact"
                        onButtonClick={() =>
                          router.push(`/dermat/${doctor.id}`)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !searchQuery && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 rounded-lg bg-[#42c0a1] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3aae8f] transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-[#42c0a1] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 rounded-lg bg-[#42c0a1] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3aae8f] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <div className="mb-20">
        <FAQ data={faqData} />
      </div>

      <div className="flex justify-center pb-24">
        <CustomButton variant="yellow" text="Start Booking Your Consultation" />
      </div>
    </div>
  );
};

export default DermatPage;
