import React, { useState } from 'react';
import { Opinion } from './types';

interface OpinionProps {
  opinion: Opinion;
  charLimit?: number;
}

const OpinionComponent: React.FC<OpinionProps> = ({ opinion}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsExpand = opinion.text.length > 150;

  const displayedText = isExpanded 
    ? opinion.text 
    : opinion.text.slice(0,150) + (needsExpand ? '...' : '');

  return (
    <div 
      className="px-4 pt-2 pb-1 w-full"
      onClick={() => needsExpand && setIsExpanded(!isExpanded)}
    >
      <div 
        className="text-gray-800 text-right text-sm md:text-base whitespace-pre-wrap"
        style={{ wordBreak: 'break-word', lineHeight: '1.6' }}
      >
        {displayedText}
        {needsExpand && !isExpanded && (
          <span className="text-blue-500 text-xs cursor-pointer "> المزيد</span>
        )}
      </div>
    </div>
  );
};

export default OpinionComponent;