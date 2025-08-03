import React, { useState, useEffect } from 'react';
import { Poll } from './types';

const PollComponent: React.FC<{ poll: Poll }> = ({ poll }) => {
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>(poll.votes || Array(poll.options.length).fill(0));
  const [hasVoted, setHasVoted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  const totalVotes = votes.reduce((sum, vote) => sum + vote, 0);

  const getExpiryDate = (duration: string) => {
    const now = new Date();
    switch (duration) {
      case '3days':
        now.setDate(now.getDate() + 3);
        break;
      case '1week':
        now.setDate(now.getDate() + 7);
        break;
      case '10days':
        now.setDate(now.getDate() + 10);
        break;
      case '15days':
        now.setDate(now.getDate() + 15);
        break;
      case '1month':
        now.setMonth(now.getMonth() + 1);
        break;
      default:
        now.setDate(now.getDate() + 3);
    }
    return now;
  };

  const calculateTimeRemaining = () => {
    if (!poll.durationInDays) return;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + poll.durationInDays);
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();

    if (diff <= 0) {
      setIsExpired(true);
      setTimeRemaining('منتهي');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    setTimeRemaining(`${days} يوم و ${hours} ساعة`);
  };

  useEffect(() => {
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, [poll.durationInDays]);

  const handlePollSelect = (index: number) => {
    if (hasVoted || isExpired) return;
    
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

  const renderPollStatus = () => {
    if (!poll.durationInDays) return null;
    
    return (
      <div className={`text-xs mb-2 ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
        {isExpired ? (
          <span>انتهى الاستطلاع</span>
        ) : (
          <span>متبقي: {timeRemaining}</span>
        )}
      </div>
    );
  };

  return (
    <div className="px-3 pt-1 pb-4">
      <h4 className="font-medium text-gray-900 mb-2 text-right text-sm md:text-base">
        {poll.question}
      </h4>
      
      {renderPollStatus()}
      
      <div className="space-y-2">
        {poll.options.map((option, index) => (
          <div 
            key={index}
            onClick={() => handlePollSelect(index)}
            className={`py-1.5 px-2.5 border rounded-lg text-right transition-all relative overflow-hidden ${
              selectedPollOption === index 
                ? 'border-blue-300 bg-blue-50 text-blue-700' 
                : isExpired || hasVoted
                  ? 'border-gray-200 text-gray-500 cursor-default'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer'
            } text-sm md:text-base`}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-blue-100 opacity-20"
              style={{
                width: (hasVoted || isExpired) ? `${calculatePercentage(votes[index], totalVotes)}%` : '0%',
                transition: 'width 0.3s ease'
              }}
            />
            <div className="relative z-10 flex justify-between items-center">
              <span className="text-sm md:text-base">{option}</span>
              {(hasVoted || isExpired) && (
                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                  {calculatePercentage(votes[index], totalVotes)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {(hasVoted || isExpired) && (
        <div className="text-xs text-gray-500 mt-1">
          مجموع المصوتين: {totalVotes}
        </div>
      )}
    </div>
  );
};

export default PollComponent;