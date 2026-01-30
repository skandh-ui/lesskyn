"use client";
import img from "@/public/assets/RightQuiz.svg"
// import { startNewQuiz } from "@/lib/startNewQuiz";
import Image from "next/image";
import { useRouter } from "next/navigation";
const QuizIntroSection = () => {
    const router = useRouter();
    const navigate = (path: string) => {
      router.push(path);
    }
  return (
    <section className="relative w-full bg-white py-[20px] md:py-[120px]">
      <div className="mx-auto max-w-[1526px] md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[40px] justify-items-center md:justify-items-start">

          
          {/* LEFT CONTENT */}
          <div className="max-w-[520px] w-full flex flex-col items-center md:items-start text-center md:text-left">

            {/* CTA Button */}
            <button
            onClick={() => {
              // startNewQuiz();
              navigate("/q1");
            }}

              className="
                mb-8
                rounded-full
                bg-[#FFAD71]
                w-[105px]
                md:w-[364px]
                h-[34px]
                md:h-[93px]
                md:px-10 md:py-4
                font-montserrat
                text-[8px]
                md:text-[24px] font-semibold
                text-black
                border
                border-black/50
                md:border-black/100
                cursor-pointer
              "
            >
              Take The Quiz
            </button>

            {/* Heading */}
            <h2
             className="
             hidden
             md:block
                font-montserrat
                font-semibold
                text-[40px]
                leading-[1]
                tracking-normal
                text-black
                "

            >
             Not Sure What Suits Your Skin? Let’s Fix That!
            </h2>
            <h2
             className="
             block
             md:hidden
                font-montserrat
                font-semibold
                text-[14px]
                w-[58%]
                leading-[1]
                tracking-normal
                text-black
                mt-[-12px]
                "

            >
             A few questions. A routine that actually fits.
            </h2>

            {/* Description */}
            <p
            className="
            hidden md:block
            font-montserrat
            font-medium
            text-[28px]
            leading-[32px]
            tracking-normal
            text-black
            mt-[20px]
            "

            >
              Take a 2-Minute Skin Quiz for Your Personalized Skincare Routine
            </p>
             <p
            className="
            block md:hidden
            font-montserrat
            font-medium
            text-[8px]
            w-[67%]
            leading-[12px]
            tracking-normal
            text-black
            mt-[12px]
            "

            >
              Answer a short, science-backed questionnaire and we decode your skin type, concerns, lifestyle, and environment to build a routine made just for you.
            </p>
            <div
            className="
              relative
              h-[180px]
              w-[217px]
              rounded-3xl
              bg-white
              md:hidden flex items-center justify-center mx-auto

              mt-[20px]
            "
          >
            <span className="text-black/40 font-montserrat">
             <Image src={img} alt="" />
            </span>
          </div>
          </div>

          {/* RIGHT IMAGE PLACEHOLDER */}
          <div
            className="
            hidden
              relative
              h-[556px]
              w-[670px]
              rounded-3xl
              bg-white
              md:flex items-center justify-center
            "
          >
            <span className="text-black/40 font-montserrat">
             <Image src={img} alt="" />
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default QuizIntroSection;
