import React, { useState, useMemo } from 'react';

interface TextExpanderProps {
  text: string;
  charLimit?: number;
  className?: string;
  dir?: 'rtl' | 'ltr';
  buttonClassName?: string;
}

export const TextExpander: React.FC<TextExpanderProps> = ({
  text,
  charLimit = 200,
  className = '',
  dir = 'rtl',
  buttonClassName = 'text-blue-500 lg:text-sm text-xs cursor-pointer hover:underline focus:outline-none mr-1'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { displayText, needsTruncation } = useMemo(() => {
    if (isExpanded || !text) {
      return { displayText: text, needsTruncation: false };
    }

    // حساب الطول مع مراعاة الأحرف العربية
    let length = 0;
    let lastValidIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      // الأحرف العربية وغير اللاتينية تحتسب كحرفين
      length += char.charCodeAt(0) > 127 ? 2 : 1;
      
      if (length <= charLimit) {
        lastValidIndex = i + 1; // +1 لأن substring لا يشمل النهاية
      } else {
        break;
      }
    }

    // إذا كان النص أقصر من الحد
    if (length <= charLimit) {
      return { displayText: text, needsTruncation: false };
    }

    // البحث عن آخر مسافة قبل النقطة المقطوعة
    const spaceIndex = text.lastIndexOf(' ', lastValidIndex);
    const truncateAt = spaceIndex > charLimit / 2 ? spaceIndex : lastValidIndex;

    return {
      displayText: text.substring(0, truncateAt) + '...',
      needsTruncation: true
    };
  }, [text, isExpanded, charLimit]);

  return (
    <div className={`whitespace-pre-wrap ${className}`} dir={dir} style={{ wordBreak: 'break-word', lineHeight: '1.6' }}>
      {displayText}
      {needsTruncation && !isExpanded && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
          className={buttonClassName}
        >
          المزيد
        </button>
      )}
    </div>
  );
};