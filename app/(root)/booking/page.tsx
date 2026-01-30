"use client";

import leftgirl from "@/public/assets/leftgirl.svg";
import rightgirl from "@/public/assets/rightGirl.svg";
import middlegirl from "@/public/assets/middlegirl.svg";
import hero from "@/public/assets/Purple_back.svg";
import smallpf from "@/public/assets/100+.svg";
import pinkBottle from "@/public/assets/pinkBottle.svg";
import yello from "@/public/assets/yelo.svg";
import orange from "@/public/assets/orangeCine.svg";
import yellowBottle from "@/public/assets/yellobottle.svg";
import blueB from "@/public/assets/bluebpot.svg";
import Infhead from "@/public/assets/Talk to your favorite Skincare Influencer.svg";
import InfluencerCard from "@/components/InfluencerCard";
import CustomButton from "@/components/CustomButton";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Infheadmobile from "@/public/assets/Talk to your favorite Skincare Influencer mobile.svg";

import girlleft from "@/public/assets/leftkudi.svg";
import girlmid from "@/public/assets/midkudi.svg";
import girlright from "@/public/assets/rightkudi.svg";
import Image from "next/image";
import FAQ, { FAQItem } from "@/components/FAQ";
import StepProcess from "@/components/StepProcess";
type Influencer = {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  socials?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  durations: number[];
  price: number;
};

const faqData: FAQItem[] = [
  {
    question:
      "Are Skincare Besties clinically approved to give skincare advice?",
    answer:
      "No. Skincare Besties are skincare creators, not medical professionals.\nThey share experience-based learnings from products they've personally tried. Their guidance is meant for learning and discovery, and we always recommend doing your own research before acting on any advice.",
  },
  {
    question: "Why should I book a video call with a Skincare Bestie?",
    answer:
      "A call with a Skincare Bestie helps you learn from real-life skincare journeys—the wins, the mistakes, and what actually worked over time.\n\nThey're especially helpful if you're:\n• New to skincare and don't know where to start\n• Confused about basics like cleansing, exfoliating, layering, or sunscreen\n• Trying to understand how products feel and perform IRL\n• Looking to build a routine that fits your budget and lifestyle\n\nThink of it as learning from someone who’s already made the mistakes, so you don’t have to.",
  },
  {
    question: "Are Skincare Besties paid to promote or advertise products?",
    answer:
      "No. Skincare Besties are not paid to promote specific products on LesSkyn.\n\nThey are free to suggest or discuss products purely based on their personal experiences.\n\nThat said, LesSkyn does not guarantee or verify individual opinions. This is a democratic, peer-to-peer platform designed to connect creators with skincare beginners and enthusiasts—not a clinical advisory service.",
  },
  {
    question: "When should I NOT rely on a Skincare Bestie?",
    answer:
      "You should avoid relying on Skincare Besties if you’re experiencing:\n• Moderate to severe acne\n• Persistent pigmentation or melasma\n• Rashes, infections, or allergic reactions\n• Sudden or worsening skin conditions\n\nIn such cases, we strongly recommend heading to our Dermatologist & Clinical Expert section for professional care.",
  },
  {
    question: "How do I know which Skincare Bestie to talk to?",
    answer:
      "Each Skincare Bestie profile includes:\n• Their Instagram handle (their public portfolio)\n• A short one-liner about their skin type, concerns, or focus areas\n\nWe recommend reviewing this before booking to ensure their experience aligns with what you want.",
  },
  {
    question:
      "Is advice from Skincare Besties a replacement for dermat consultation?",
    answer:
      "No. Skincare Besties do not replace dermatologists.\nTheir insights are experience-based, not medical advice, and should be used for learning, not diagnosis or treatment.",
  },
  {
    question: "What is LesSkyn’s role in these conversations?",
    answer:
      "LesSkyn is a connection platform. We enable conversations between users and creators, but:\n• We do not medically validate creator opinions\n• We do not guarantee outcomes\n• We encourage informed, responsible skincare decisions\n\nOur goal is to help you learn smarter, avoid common mistakes, and know when to seek expert help.",
  },
  {
    question: "Can I get honest product reviews from Skincare Besties?",
    answer:
      "Yes. Skincare Besties share authentic, first-hand experiences with products they've personally used, how it felt on their skin, how long it took to see results, and what they'd do differently.\n\nThat said, honesty ultimately depends on the individual Skincare Bestie. LesSkyn actively promotes authenticity and transparency, but as an open and democratic platform, we don't control or script what creators share. We encourage users to listen, learn, and make informed decisions.\n\nThese are real-user perspectives, not brand claims or label promises.",
  },
  {
    question: "Are Skincare Besties paid to say certain things?",
    answer:
      "No. Skincare Besties are not paid by brands through LesSkyn to promote or advertise products. Their suggestions are based on personal experience, not sponsorship mandates.\n\nHowever, since this is a peer-to-peer platform, LesSkyn does not guarantee or medically validate individual opinions. The intent is learning and discovery, not clinical advice.",
  },
  {
    question: "How do Skincare Besties earn from calls?",
    answer:
      "When you book a call:\n• LesSkyn charges a 10% platform fee (plus applicable transaction charges)\n• The remaining amount is paid directly to your Skincare Bestie\n\nThis helps creators earn for their time while allowing LesSkyn to maintain and improve the platform.",
  },
];

const pinkStepsData = [
  "Choose from Skin Besties based on your skin type, concerns, budget, and preference.",
  "Book a slot based on their availability.",
  "Ask about real results, mistakes to avoid, and what actually worked for them.",
];

const Page = () => {
  const router = useRouter();
  const gridRef = useRef<HTMLElement>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Use influencers directly from API (no slicing needed)
  const currentInfluencers = influencers.filter((inf) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      inf.name?.toLowerCase().includes(query) ||
      inf.bio?.toLowerCase().includes(query)
    );
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Fetch influencers from API
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/experts?type=influencer&page=${currentPage}&limit=${itemsPerPage}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch influencers");
        }

        const data = await response.json();
        setInfluencers(data.experts || []);
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
        console.error("Error fetching influencers:", err);
        setError("Failed to load influencers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, [currentPage]);

  useEffect(() => {
    const handler = () => setShowRegisterModal(true);
    window.addEventListener("open-register-influencer", handler);
    return () =>
      window.removeEventListener("open-register-influencer", handler);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="flex justify-center pt-16">
        {/* PURPLE BG CONTAINER */}
        <div className="relative hidden md:block w-[1665px] max-w-full">
          <div className="absolute z-30 inset-0 hidden md:block pointer-events-none">
            <Image
              alt="pink bottle"
              src={pinkBottle}
              className="w-15 absolute top-[10px] left-12"
            />
            <Image
              alt="yellow decoration"
              src={yello}
              className="w-20 absolute top-[-20px] right-124"
            />
            <Image
              alt="orange decoration"
              src={orange}
              className="w-[66.51015946628933px] absolute top-[50px] right-[-18px]"
            />
            <Image
              alt="yellow bottle"
              src={yellowBottle}
              className="w-12 absolute bottom-[120px] left-0"
            />
            <Image
              alt="blue decoration"
              src={blueB}
              className="w-[38.7px] absolute bottom-[120px] right-10"
            />
          </div>
          {/* Background Image */}
          <Image
            src={hero}
            alt="purple-bg"
            className="w-full h-[824px] object-cover rounded-3xl"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#B34B87]/60 to-transparent rounded-3xl" />

          {/* Overlay Content – NOW RELATIVE TO PURPLE BG */}
          <div className="absolute inset-0 flex items-center justify-between px-">
            {/* LEFT TEXT BLOCK */}
            <div className="max-w-xl ml-[80px]">
              <Image src={Infhead} alt="" />

              <p className="mt-5 font-montserrat font-normal text-[24px] leading-[1.25] text-black">
                Get personalized skincare advice from trusted influencers. Ask
                questions, build your routine, and achieve the skin of your
                dreams.
              </p>

              <div className="mt-[20px] max-w-lg">
                <CustomButton
                  variant="orange"
                  text="Book Video Call from 40+ Skin Besties"
                />
              </div>
            </div>

            {/* RIGHT IMAGE BLOCK */}
            {/* RIGHT IMAGE BLOCK */}
            <div className="relative w-[995px] h-[415px] flex items-center justify-center">
              <div
                className="relative ml-20 w-full h-full overflow-hidden
                  [mask-image:linear-gradient(to_top,transparent_0%,black_35%,black_100%)]
                  [-webkit-mask-image:linear-gradient(to_top,transparent_0%,black_35%,black_100%)]"
              >
                {/* LEFT MODEL */}
                <Image
                  src={leftgirl}
                  alt="leftgirl"
                  className="
                        absolute
                        bottom-0
                        left-[-70px]
                        w-[415px] h-[415px]
                        z-10
                        "
                />

                {/* MIDDLE MODEL (dominant) */}
                <Image
                  src={middlegirl}
                  alt="middlegirl"
                  className="
                        absolute
                        bottom-0
                        left-[180px]
                        w-[445px] h-[425px]
                        z-10
                        "
                />

                {/* RIGHT MODEL */}
                <Image
                  src={rightgirl}
                  alt="rightgirl"
                  className="
                        absolute
                        bottom-0
                        left-[450px]
                        w-[415px] h-[415px]
                        z-10
                        "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block md:hidden flex justify-center pt-0">
        <div className="relative w-[355px]">
          {/* Purple background */}
          <Image
            src={hero}
            alt="purple-bg"
            className="w-full h-[301px] object-cover rounded-3xl"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#B34B87]/60 to-transparent rounded-3xl" />

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center px-4 pt-6 text-center">
            {/* Heading */}
            <Image
              src={Infheadmobile}
              alt="heading"
              className="h-[49px] mb-5"
            />

            {/* Description */}
            <p className="text-[8px] font-montserrat text-black leading-tight max-w-[285px]">
              Get personalized skincare advice from trusted influencers. Ask
              questions, build your routine, and achieve the skin of your
              dreams.
            </p>

            {/* Trust badge */}
            <div className="flex items-center gap-2 mt-3">
              <Image
                src={smallpf}
                alt="users"
                className="w-[28px] h-auto rounded-full"
              />
              <p className="font-montserrat font-medium text-[9px] text-black">
                50+ Influencers
              </p>
            </div>

            {/* Spacer */}
            <div
              className="
                    relative
                    w-full
                    h-[115px] 
                    overflow-hidden
                    [mask-image:linear-gradient(to_top,transparent_0%,black_35%,black_100%)]
                    [-webkit-mask-image:linear-gradient(to_top,transparent_0%,black_35%,black_100%)]
                  "
            >
              {/* Left */}
              <Image
                src={girlleft}
                alt="left model"
                className="
                      absolute
                      bottom-0
                      z-10
                      left-[50px]
                      w-[111px]
                      z-10
                    "
              />

              {/* Middle (dominant) */}
              <Image
                src={girlmid}
                alt="middle model"
                className="
                      absolute
                      bottom-0
                      z-0
                      left-1/2
                      ml-2
                      -translate-x-1/2
                      w-[118px]
                      z-20
                    "
              />

              {/* Right */}
              <Image
                src={girlright}
                alt="right model"
                className="
                      absolute
                      bottom-0
                      right-[20px]
                      w-[118px]
                      z-10
                    "
              />
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-center mb-4">How It Works</h2>
        <StepProcess variant="pink" steps={pinkStepsData} />
        <h1 className="text-2xl font-bold text-center mb-8">
          40+ Skin Besties Just a Click Away
        </h1>
      </section>

      <section
        ref={gridRef}
        className="w-full bg-white mb-[-90px] md:mb-[0px] md:py-24"
      >
        <div className="max-w-[1246px] mx-auto ">
          {/* Search Box */}
          <div className="max-w-xl mx-auto mb-8 px-4">
            <input
              type="text"
              placeholder="Search by name or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-lg border-2 border-gray-200 focus:border-[#B34B87] focus:outline-none text-black placeholder-gray-400 transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B34B87] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading influencers...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-[#B34B87] text-white rounded-lg hover:bg-[#9d3f74] transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : influencers.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <p className="text-gray-600">
                No influencers available at the moment.
              </p>
            </div>
          ) : (
            <div className="flex flex-cols justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-10 py-[10px]">
                {currentInfluencers.map((inf) => (
                  <div
                    key={inf.id}
                    onClick={() => router.push(`/booking/${inf.id}`)}
                    className="cursor-pointer"
                  >
                    <InfluencerCard
                      name={inf.name}
                      subtitle={inf.bio || "Skincare Expert"}
                      avatar={inf.avatar}
                      socials={inf.socials}
                      price={`₹${inf.price || 0}`}
                      duration={`${inf.durations?.[0] || 30} mins`}
                      size="compact"
                    />
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
                className="px-4 py-2 rounded-lg bg-[#B34B87] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#9d3f74] transition-colors"
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
                        ? "bg-[#B34B87] text-white"
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
                className="px-4 py-2 rounded-lg bg-[#B34B87] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#9d3f74] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="mt-30 md:mt-32">
        <FAQ data={faqData} />
      </div>

      <section className="w-full bg-white py-16 flex justify-center">
        <div className="max-w-lg px-4">
          <CustomButton variant="orange" text="Start Booking Calls Now!" />
        </div>
      </section>
    </div>
  );
};

export default Page;
