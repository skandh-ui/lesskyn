import React, { useState } from 'react';

// Interface for the structure of each FAQ item
export interface FAQItem {
  question: string;
  answer: string;
}

// Props for the main FAQ component
interface FAQProps {
  data: FAQItem[];
}

// Component for a single FAQ item
const FAQItemComponent: React.FC<FAQItem> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-300">
      <div
        className="flex justify-between items-center py-4 cursor-pointer"
        onClick={toggleOpen}
      >
        <h3 className="text-lg font-bold pr-8">{question}</h3>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      
      {/* UPDATED SECTION: Added 'whitespace-pre-line' class */}
      {isOpen && (
        <div className="pb-4 text-gray-700 whitespace-pre-line leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

// Main FAQ component
const FAQ: React.FC<FAQProps> = ({ data }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-12">
      {/* Moved Header Here: Centered, Bold, Bigger, with margin bottom */}
      <h1 className="text-3xl font-bold text-center mb-8 mt-4">
        Frequently Asked Questions
      </h1>
      
      {data.map((item, index) => (
        // Render a FAQItemComponent for each item in the data array
        <FAQItemComponent key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default FAQ;