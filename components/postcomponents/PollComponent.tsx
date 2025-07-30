import React, { useState } from 'react';
import { Poll } from './types';

const PollComponent: React.FC<{ poll: Poll }> = ({ poll }) => {
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>(poll.votes || Array(poll.options.length).fill(0));
  const [hasVoted, setHasVoted] = useState(false);
  const totalVotes = votes.reduce((sum, vote) => sum + vote, 0);

  const handlePollSelect = (index: number) => {
    if (hasVoted) return;
    
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
    setSelectedPollOption(index);
    setHasVoted(true);
  };

  const calculatePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  return (
    <div className="px-4 pt-1 pb-1">
      <h4 className="font-medium text-gray-900 mb-3 text-right">{poll.question}</h4>
      <div className="space-y-2">
        {poll.options.map((option, index) => (
          <div 
            key={index}
            onClick={() => handlePollSelect(index)}
            className={`py-2 px-3 border rounded-lg cursor-pointer text-right transition-all relative overflow-hidden ${
              selectedPollOption === index 
                ? 'border-blue-300 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-blue-100 opacity-20"
              style={{
                width: hasVoted ? `${calculatePercentage(votes[index], totalVotes)}%` : '0%',
                transition: 'width 0.3s ease'
              }}
            />
            <div className="relative z-10 flex justify-between items-center">
              <span>{option}</span>
              {hasVoted && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {calculatePercentage(votes[index], totalVotes)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {hasVoted && (
        <div className="text-xs text-gray-500 mt-2">
          مجموع المصوتين: {totalVotes}
        </div>
      )}
    </div>
  );
};

export default PollComponent;