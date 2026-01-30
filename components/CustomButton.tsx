import React from 'react';
import Image from 'next/image';

// Using the corrected imports from your snippet
import booking_logo from '@/public/assets/booking_icon.svg';
import dermat_logo from '@/public/assets/dermat_icon.svg';

interface CustomButtonProps {
  text: string;
  variant: 'orange' | 'yellow';
  onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, variant, onClick }) => {
  const isOrange = variant === 'orange';
  
  const dynamicStyle = {
    backgroundColor: isOrange ? '#FECFBB' : '#FDE67B',
  };

  const iconSrc = isOrange ? booking_logo : dermat_logo;

  return (
    <button
      onClick={onClick}
      style={dynamicStyle}
      className={`
        /* Layout: Strictly Row (Icon Left, Text Right) */
        flex flex-row items-center flex-nowrap
        relative w-full max-w-md p-4 gap-4 
        rounded-xl border border-black/80 text-left
        cursor-pointer
        shadow-[4px_-4px_12px_rgba(0,0,0,0.1)]
        transition-all duration-300 ease-in-out

        /* Hover State: Lift up, deepen shadow, and brighten */
        hover:-translate-y-1
        hover:shadow-[6px_-6px_16px_rgba(0,0,0,0.15)]
        hover:brightness-105

        /* Active/Click State: Press down */
        active:scale-[0.98]
        active:translate-y-0
        active:shadow-[2px_-2px_8px_rgba(0,0,0,0.1)]
      `}
    >
      {/* Icon Container: Prevent shrinking so it stays on the left */ }
      <div className="flex-shrink-0 w-12 h-12 relative">
        <Image 
          src={iconSrc} 
          alt={`${variant} icon`} 
          fill 
          className="object-contain"
        />
      </div>

      {/* Text Content: flex-1 ensures it takes the remaining space on the right */ }
      <span className="flex-1 font-bold text-xl leading-tight text-black">
        {text}
      </span>
    </button>
  );
};

export default CustomButton;