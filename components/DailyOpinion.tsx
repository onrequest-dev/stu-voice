import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { TextExpander } from './TextExpander';
interface DailyThoughtProps {
  thought: string;
  className?: string;
}

const DailyOpinion: React.FC<DailyThoughtProps> = ({ thought, className = '' }) => {
  const [visible, setVisible] = useState(true);

  return (
    <div className="relative w-full">
      {/* زر عائم أعلى منتصف الشاشة */}
      <button
        onClick={() => setVisible(!visible)}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-500 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        {visible ? (
          <FaChevronUp className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <FaChevronDown className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </button>

      {/* اللوحة الطافية مع انميشن CSS */}
      <div
        className={`fixed top-16 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md transition-all duration-500 ease-in-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'
        } ${className}`}
      >
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 border border-blue-200 text-center">
            <TextExpander
              text={thought}
              charLimit={220}
              className="text-sm sm:text-[13px]"
              />
          <div className="mt-1">
            <span className="text-xs text-blue-400">•</span>
            <span className="text-xs text-gray-400 mx-1">الرأي اليومي STUvoice</span>
            <span className="text-xs text-blue-400">•</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyOpinion;
