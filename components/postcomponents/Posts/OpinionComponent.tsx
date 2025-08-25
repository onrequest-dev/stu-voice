import React from 'react';
import { Opinion } from '../types';
import { TextExpander } from '../../TextExpander';

interface OpinionProps {
  opinion: Opinion;
  charLimit?: number;
}

const OpinionComponent: React.FC<OpinionProps> = ({ opinion, charLimit = 600 }) => {
  return (
    <div className="px-4 pt-2 pb-1 w-full" dir="rtl">
      <TextExpander 
        text={opinion.text}
        charLimit={charLimit}
        className="text-gray-800 text-right text-sm md:text-base"
        dir="rtl"
      />
    </div>
  );
};

export default OpinionComponent;