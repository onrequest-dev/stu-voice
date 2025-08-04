import React, { useState, useMemo } from 'react';
import { Opinion } from './types';


interface OpinionProps {
  opinion: Opinion;
  charLimit?: number;
}

const OpinionComponent: React.FC<OpinionProps> = ({ opinion, charLimit = 200 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { displayText, needsTruncation } = useMemo(() => {
    if (isExpanded) {
      return { displayText: opinion.text, needsTruncation: false };
    }

    let length = 0;
    let lastValidIndex = 0;
    const text = opinion.text;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      length += char.charCodeAt(0) > 127 ? 2 : 1;
      
      if (length <= charLimit) {
        lastValidIndex = i;
      } else {
        break;
      }
    }

    if (length <= charLimit) {
      return { displayText: text, needsTruncation: false };
    }

    // البحث عن آخر مسافة قبل النقطة المقطوعة
    let truncateAt = text.lastIndexOf(' ', lastValidIndex);
    if (truncateAt < charLimit / 2) {
      truncateAt = lastValidIndex;
    }

    return {
      displayText: text.substring(0, truncateAt) + '...',
      needsTruncation: true
    };
  }, [opinion.text, isExpanded, charLimit]);

  return (
    <div className="px-4 pt-2 pb-1 w-full" dir="rtl">
      <div 
        className="text-gray-800 text-right text-sm md:text-base whitespace-pre-wrap"
        style={{ wordBreak: 'break-word', lineHeight: '1.6' }}
      >
        {displayText}
        {needsTruncation && !isExpanded && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="text-blue-500 lg:text-sm text-xs cursor-pointer hover:underline focus:outline-none mr-1"
          >
            المزيد
          </button>
        )}
      </div>
    </div>
  );
};

export default OpinionComponent;