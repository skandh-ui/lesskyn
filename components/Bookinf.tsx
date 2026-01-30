"use client";
import pic  from "@/public/assets/pic2.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
const Bookinf = () => {
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  }
  return (
    <section className="relative w-full bg-white py-[40px] md:py-[120px]">
  <div className="mx-auto max-w-[1526px] px-6 md:px-20">
    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[40px] justify-items-center md:justify-items-start">

        <div className="hidden md:flex relative h-[515px] w-[550px] rounded-3xl bg-white items-center justify-center">
        <Image src={pic} alt="" />
      </div>

      {/* TEXT CONTENT */}
      <div className="max-w-[520px] w-full flex flex-col items-center md:items-end text-center md:text-right">

        {/* CTA */}
        <button
          onClick={() => navigate("/booking")}
          className="
            mb-6
            rounded-full
            bg-[#FCFCA2]
            w-[93px] md:w-[364px]
            h-[34px] md:h-[93px]
            font-montserrat
            text-[8px] md:text-[24px]
            font-semibold
            text-black
            border
            border-black/50
            md:border-black/100
          "
        >
          Book a Call
        </button>

        {/* Heading */}
        <h2 className="font-montserrat font-semibold w-[60%] md:w-full text-[14px] md:text-[40px] leading-[1] text-black">
          Real skin advice, from people who get it.
        </h2>

        {/* Description */}
        <p className="hidden md:block font-montserrat font-medium text-[8px] md:text-[28px] leading-[12px] md:leading-[32px] text-black mt-[12px] md:mt-[20px]">
          Chat 1:1 with trusted skincare creators who’ve dealt with real skin issues and share what actually works for Indian skin
        </p>

        <p className="block md:hidden font-montserrat font-medium text-[8px] w-[80%] md:text-[28px] leading-[12px] md:leading-[32px] text-black mt-[12px] md:mt-[20px]">
          Connect with trusted skincare creators who’ve dealt with real skin concerns and know what actually works—no filters, no fluff.
        </p>

        {/* MOBILE IMAGE CARD */}
        <div className="md:hidden relative h-[180px] w-[217px] rounded-3xl bg-white flex items-center justify-center mt-[60px] md:mt-[20px]">
          <Image src={pic} alt="" />
        </div>
      </div>

      {/* DESKTOP IMAGE */}
    

    </div>
  </div>
</section>

  );
};

export default Bookinf;
