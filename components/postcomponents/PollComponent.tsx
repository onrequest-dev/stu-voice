import React, { useState, useEffect } from 'react';
import { Poll } from './types';
import { FiEye } from 'react-icons/fi';
import { handelreactionInStorage } from '@/client_helpers/handelreaction';
import { randomDelay } from '@/client_helpers/delay';

const PollComponent: React.FC<{ poll: Poll, id?: string }> = ({ poll, id }) => {
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>(poll.votes || Array(poll.options.length).fill(0));
  const [hasVoted, setHasVoted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  const totalVotes = votes.reduce((sum, vote) => sum + vote, 0);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasAlredyVoted,setHasAlredyVoted] = useState(false);

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

  // استرجاع التصويت من التخزين المحلي عند تحميل الكومبوننت
  useEffect(() => {
    if (!id) return;

    try {
      const storedVotesString = localStorage.getItem("votes");
      if (!storedVotesString) return;

      const storedVotes = JSON.parse(storedVotesString); // متوقع مصفوفة من {id:number, type:string}
      if (!Array.isArray(storedVotes)) return;

      // ابحث عن تصويت للـ id الحالي
      const foundVote = storedVotes.find((v: {id:number, type:string}) => v.id === parseInt(id));

      if (foundVote) {
        setHasAlredyVoted(true);
        const optionIndex = poll.options.findIndex(opt => opt === foundVote.type);
        if (optionIndex !== -1) {
          setSelectedPollOption(optionIndex);
          setHasVoted(true);
          setShowResults(true);
          // يمكن تحميل الأصوات لتحديث الواجهة
          loadVotes();
        }
      }
    } catch (error) {
      console.error("خطأ في قراءة التصويت من التخزين المحلي", error);
    }
  }, [id, poll.options]);

  const calculatePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const handlePollSelect = async (index: number) => {
  if (hasVoted || isExpired || loading || !id) return;

  // حفظ التصويت محليًا
  handelreactionInStorage("votes", id, poll.options[index], "set");
  setSelectedPollOption(index);
  setLoading(true);

  if (hasAlredyVoted) await randomDelay(2);
  await randomDelay(0.5);

  let votes_result: Response;

  if (!hasAlredyVoted) {
    const result = await fetch('/api/opinions/sendreactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes: [{ id: id ? parseInt(id) : 0, type: poll.options[index] }],
      }),
    });

    if (!result.ok) {
      setLoading(false);
      return;
    }
  }

  votes_result = await fetch('/api/opinions/getvotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vote_id: id ? parseInt(id) : 0,
    }),
  });

  if (!votes_result.ok) {
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
      console.log("خطأ عند جلب الأصوات");
    } finally {
      setLoading(false);
    }
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
            className={`py-1.5 px-2.5 border rounded-lg transition-all relative overflow-hidden text-sm md:text-base text-right
              ${
                selectedPollOption === index
                  ? 'border-blue-500 bg-blue-100 text-blue-800 cursor-default'
                  : isExpired || hasVoted || loading
                  ? 'border-gray-200 text-gray-500 cursor-default'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer'
              }
            `}
            dir="rtl"
            aria-disabled={isExpired || hasVoted || loading}
          >
            {/* خلفية النسبة */}
            <div
              className="absolute left-0 top-0 h-full bg-blue-100 opacity-20"
              style={{
                width:
                  (hasVoted || (isExpired && showResults)) && votes[index] !== undefined
                    ? `${calculatePercentage(votes[index], totalVotes)}%`
                    : '0%',
                transition: 'width 0.3s ease',
              }}
            />

            <div className="relative z-10 flex justify-between items-center">
              <span>{option}</span>

              {loading && selectedPollOption === index ? (
                <span className="flex items-center space-x-2" dir="ltr">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </span>
              ) : (hasVoted || (isExpired && showResults)) ? (
                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full" dir="ltr">
                  {calculatePercentage(votes[index], totalVotes)}%
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {(hasVoted || (isExpired && showResults)) && poll.options.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">مجموع المصوتين: {totalVotes}</div>
      )}

      {isExpired && !showResults && !loading && poll.options.length > 0 && (
        <button
          onClick={loadVotes}
          className="mt-3 flex items-center space-x-1 px-2 py-1 bg-blue-100 bg-opacity-30 text-blue-700 rounded hover:bg-blue-200 transition"
          dir="rtl"
          aria-label="عرض نتائج التصويت"
          style={{ fontSize: '0.875rem' }}
        >
          <FiEye className="w-4 h-4" aria-hidden="true" />
          <span>عرض نتائج التصويت</span>
        </button>
      )}
    </div>
  );
};

export default PollComponent;
