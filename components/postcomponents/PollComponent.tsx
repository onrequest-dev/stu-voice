import React, { useState, useEffect } from 'react';
import { Poll } from './types';
import { FiEye } from 'react-icons/fi';

const PollComponent: React.FC<{ poll: Poll, id?: string }> = ({ poll, id }) => {
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>(poll.votes || Array(poll.options.length).fill(0));
  const [hasVoted, setHasVoted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  const totalVotes = votes.reduce((sum, vote) => sum + vote, 0);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

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

    setTimeRemaining(
      [days > 0 ? `${days} يوم` : '', hours > 0 ? `${hours} ساعة` : ''].filter(Boolean).join(' و ') || 'الوقت انتهى'
    );
  };

  useEffect(() => {
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, [poll.durationInDays]);

  const handlePollSelect = async (index: number) => {
    if (hasVoted || isExpired) return;
    setLoading(true);

    const [result, votes_result] = await Promise.all([
      fetch('/api/opinions/sendreactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          votes: [{ id: id ? parseInt(id) : 0, type: poll.options[index] }],
        }),
      }),
      fetch('/api/opinions/getvotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vote_id: id ? parseInt(id) : 0,
        }),
      }),
    ]);

    if (!result.ok || !votes_result.ok) {
      setLoading(false);
      return;
    }

    const votesData = await votes_result.json();

    const votesArray = Array(poll.options.length).fill(0);
    votesData.vote.forEach((vote: any) => {
      const optionIndex = poll.options.findIndex((opt) => opt === vote.title);
      if (optionIndex !== -1) {
        votesArray[optionIndex] = vote.votes_count;
      }
    });

    setVotes(votesArray);
    setSelectedPollOption(index);
    setHasVoted(true);
    setShowResults(true);
    setLoading(false);
  };

  const loadVotes = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const votes_result = await fetch('/api/opinions/getvotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote_id: parseInt(id) }),
      });
      if (votes_result.ok) {
        const votesData = await votes_result.json();
        const votesArray = Array(poll.options.length).fill(0);
        votesData.vote.forEach((vote: any) => {
          const optionIndex = poll.options.findIndex((opt) => opt === vote.title);
          if (optionIndex !== -1) {
            votesArray[optionIndex] = vote.votes_count;
          }
        });
        setVotes(votesArray);
        setShowResults(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const renderPollStatus = () => {
    if (!poll.durationInDays) return null;

    return (
      <>
        {poll.options.length > 0 && (
          <div className={`text-xs mb-2 ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
            {isExpired ? <span>انتهى الاستطلاع</span> : <span>متبقي: {timeRemaining}</span>}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="px-3 pt-1 pb-4">
      <h4 className="font-medium text-gray-900 mb-2 text-right text-sm md:text-base">{poll.question}</h4>

      {renderPollStatus()}

      <div className="space-y-2">
        {poll.options.map((option, index) => (
          <div
            key={index}
            onClick={() => handlePollSelect(index)}
            className={`py-1.5 px-2.5 border rounded-lg transition-all relative overflow-hidden ${
              selectedPollOption === index
                ? 'border-blue-300 bg-blue-50 text-blue-700'
                : isExpired || hasVoted
                ? 'border-gray-200 text-gray-500 cursor-default'
                : 'border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer'
            } text-sm md:text-base`}
            dir="rtl"
          >
            <div
              className="absolute left-0 top-0 h-full bg-blue-100 opacity-20"
              style={{
                width:
                  hasVoted || (isExpired && showResults)
                    ? `${calculatePercentage(votes[index], totalVotes)}%`
                    : '0%',
                transition: 'width 0.3s ease',
              }}
            />

            <div className="relative z-10 flex justify-between items-center">
              <span className="text-sm md:text-base text-right">{option}</span>

              {(hasVoted || (isExpired && showResults)) && !loading && (
                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full" dir="ltr">
                  {calculatePercentage(votes[index], totalVotes)}%
                </span>
              )}

              {loading && (
                <span
                  className="inline-block bg-gray-300 rounded-full h-4 w-12 animate-pulse"
                  dir="ltr"
                  aria-label="Loading"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {(hasVoted || (isExpired && showResults)) && poll.options.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">مجموع المصوتين: {totalVotes}</div>
      )}

      {/* زر عرض النتائج فقط إذا الاستطلاع منتهي ولم تعرض النتائج بعد */}
      {isExpired && !showResults && !loading && poll.options.length > 0 && (
        <button
          onClick={loadVotes}
          className="mt-3 flex items-center space-x-1 px-2 py-1 bg-blue-100 bg-opacity-30 text-blue-700 rounded hover:bg-blue-200 transition"
          dir="rtl"
          aria-label="عرض نتائج التصويت"
          style={{ fontSize: '0.875rem' }} // 14px تقريبا
        >
          <FiEye className="w-4 h-4" aria-hidden="true" />
          <span>عرض نتائج التصويت</span>
        </button>
      )}
    </div>
  );
};

export default PollComponent;
