"use client";
import Image from "next/image";
import PinkStar from "@/public/assets/star pink q1.svg";
import blueBottle from "@/public/assets/blueBottle.svg";
import Purplebottle from "@/public/assets/purple top left.svg";
import yellowtop from "@/public/assets/yellow top right.svg";
import yellowbottle from "@/public/assets/yellowbottom.svg";
import GreenStar from "@/public/assets/greenBottomRight.svg";
import purpleright from "@/public/assets/Purpleright.svg";
import Q1 from "@/components/q1";
import Q2 from "@/components/q2";
import Q3 from "@/components/q3";
import Q4 from "@/components/q4";
import { useSearchParams } from "next/navigation";

const QuizPage = () => {
  const searchParams = useSearchParams();
  const step = searchParams.get("step") || "1";

  const renderQuizStep = () => {
    switch (step) {
      case "1":
        return <Q1 />;
      case "2":
        return <Q2 />;
      case "3":
        return <Q3 />;
      case "4":
        return <Q4 />;
      default:
        return <Q1 />;
    }
  };

  return (
    <div className="min-h-[100svh] text-white bg-gradient-to-r from-[#0A0433] via-[#47126B] to-[#FE639C] relative">
      {/* DECORATIVE SIDES */}
      <div className="absolute inset-0 hidden md:block pointer-events-none">
        <Image
          alt="Pink star"
          src={PinkStar}
          className="w-20 absolute top-10 left-90"
        />
        <Image
          alt="Blue bottle"
          src={blueBottle}
          className="w-20 absolute top-[80%] left-0"
        />
        <Image
          alt="Purple bottle"
          src={Purplebottle}
          className="w-20 absolute top-30 left-0"
        />
        <Image
          alt="Green star"
          src={GreenStar}
          className="w-20 absolute bottom-0 right-0"
        />
        <Image
          alt="Yellow top"
          src={yellowtop}
          className="w-20 absolute top-[10%] right-0"
        />
        <Image
          alt="Yellow bottle"
          src={yellowbottle}
          className="w-20 absolute bottom-0 right-[45%]"
        />
        <Image
          alt="Purple right"
          src={purpleright}
          className="w-20 absolute top-[45%] right-0"
        />
      </div>

      {/* QUIZ CONTENT */}
      {renderQuizStep()}
    </div>
  );
};

export default QuizPage;
