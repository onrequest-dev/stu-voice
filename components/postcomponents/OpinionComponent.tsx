import React from 'react';
import { Opinion } from './types';

interface OpinionProps {
  opinion: Opinion;
}

const OpinionComponent: React.FC<OpinionProps> = ({ opinion }) => {
  return (
    <div className="px-4 pt-2 pb-1">
      <p className="text-gray-800 mb-2 text-right">{opinion.text}</p>
    </div>
  );
};

export default OpinionComponent;