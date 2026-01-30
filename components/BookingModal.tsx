import { X } from "lucide-react";
import {  useState,useEffect } from "react";
import { InlineWidget } from "react-calendly";



interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  influencerName: string;
  calendlyLink: string;
}

const BookingModal = ({
  isOpen,
  onClose,
  influencerName,
    calendlyLink,
}: BookingModalProps) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
//   const [paymentFile, setPaymentFile] = useState<File | null>(null);

 const [skinType, setSkinType] = useState("");
const [skinConcern, setSkinConcern] = useState("");

  const [showCalendly, setShowCalendly] = useState(false);

useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  } else {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    setShowCalendly(false);
    setName("");
    setLocation("");
    setSkinType("");
    setSkinConcern("");

  }

  return () => {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };
}, [isOpen]);





const handleBookingSubmit = () => {
  setShowCalendly(true);
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overscroll-contain">
                <div
            className="
              relative
              w-full
              max-w-xl
              rounded-2xl
              bg-white
              p-4 md:p-8
              shadow-2xl

              scale-[0.92] md:scale-100
              origin-center
            "
          >
        <button onClick={onClose} className="absolute right-4 top-4">
          <X size={22} />
        </button>

        <h2 className={`font-semibold ${showCalendly ? "text-[22px]" : "text-[28px]"}`}>
          Book a Call with {influencerName}
        </h2>
                    {showCalendly  && (
                                <div
                      className="
                        mt-6
                        h-[520px] md:h-[650px]
                        rounded-xl
                        overflow-hidden
                        border

                        scale-[0.9] md:scale-100
                        origin-top
                      "
                    >

                <InlineWidget
                url={calendlyLink}
                styles={{ height: "100%", width: "100%" }}
                prefill={{
                    name,
                    location,
                }}
                pageSettings={{
                    hideLandingPageDetails: true,
                    hideEventTypeDetails: false,
                    primaryColor: "000000",
                }}
                />
            </div>
            )}

                {!showCalendly && (
      <div className="mt-6 space-y-5">
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        <input
          placeholder="Your Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />


          {/* Q1: Skin Type */}
          <select
          value={skinType}
          onChange={(e) => setSkinType(e.target.value)}
          className={`w-full rounded-xl border px-4 py-3 bg-white ${
            skinType ? "text-black" : "text-black/80"
          }`}
        >
          <option value="" disabled hidden>
            What is your Skin Type?
          </option>
          <option value="Normal Skin">Normal Skin</option>
          <option value="Oily Skin">Oily Skin</option>
          <option value="Dry Skin">Dry Skin</option>
          <option value="Combination Skin">Combination Skin</option>
          <option value="Sensitive Skin">Sensitive Skin</option>
        </select>


          {/* Q2: Skin Concern */}
         <select
            value={skinConcern}
            onChange={(e) => setSkinConcern(e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 bg-white ${
              skinConcern ? "text-black" : "text-black/80"
            }`}
          >
            <option value="" disabled hidden>
              What is your skin concern?
            </option>
            <option value="Clear Acne & Breakouts">Clear Acne & Breakouts</option>
            <option value="Reduce Oiliness & Shine">Reduce Oiliness & Shine</option>
            <option value="Hydrate Dry Skin">Hydrate Dry Skin</option>
            <option value="Minimize Pores & Blackheads">
              Minimize Pores & Blackheads
            </option>
            <option value="Even Out Skin Tone & Reduce Dark Spots">
              Even Out Skin Tone & Reduce Dark Spots
            </option>
            <option value="Reduce Redness & Sensitivity">
              Reduce Redness & Sensitivity
            </option>
            <option value="Anti-Aging : Reduce Wrinkles & Fine Lines">
              Anti-Aging : Reduce Wrinkles & Fine Lines
            </option>
            <option value="Achieve a Natural Glow">Achieve a Natural Glow</option>
          </select>


        <button
          onClick={handleBookingSubmit}
          disabled={!name || !location || !skinType || !skinConcern}
          className="w-full rounded-xl bg-[#FCFCA2] py-3 font-semibold cursor-pointer"
        >
          Proceed to Schedule
        </button>
      </div>
    )}



        
      </div>
    </div>
  );
};

export default BookingModal;
