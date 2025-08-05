'use client';
import { FaArrowUp, FaArrowDown, FaFlag, FaInfoCircle } from 'react-icons/fa';
import CustomIcon from './CustomIcon';
import { UserInfo } from './types';
import { useState, useMemo } from 'react';
import Alert from '../Alert';

interface CommentProps {
  comment: {
    id: string;
    text: string;
    likes: number;
    timestamp: string;
  };
  userInfo: UserInfo;
  onLike: () => void;
  onDislike: () => void;
  charLimit?: number;
}

const Comment = ({ comment, userInfo, onLike, onDislike, charLimit = 150 }: CommentProps) => {
  const [showReportAlert, setShowReportAlert] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { displayText, needsTruncation } = useMemo(() => {
    if (isExpanded) {
      return { displayText: comment.text, needsTruncation: false };
    }

    let length = 0;
    let lastValidIndex = 0;
    const text = comment.text;

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
  }, [comment.text, isExpanded, charLimit]);

  const handleReport = () => {
    setShowReportAlert(true);
  };

  const handleLike = () => {
    if (userVote === 'up') {
      setUserVote(null);
      onDislike();
    } else {
      setUserVote('up');
      onLike();
      if (userVote === 'down') {
        onLike();
      }
    }
  };

  const handleDislike = () => {
    if (userVote === 'down') {
      setUserVote(null);
      onLike();
    } else {
      setUserVote('down');
      onDislike();
      if (userVote === 'up') {
        onDislike();
      }
    }
  };

  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      {showReportAlert && (
        <Alert
          message="شكراً 🌹، سيتم مراجعة الإبلاغ من قبل الإدارة واتخاذ الإجراء المناسب. شكراً لحفاظك على سلامة المنصة 😊"
          type="success"
          autoDismiss={5000}
          onDismiss={() => setShowReportAlert(false)}
        />
      )}

      {/* الصف العلوي: التاريخ ومعلومات المستخدم */}
      <div className="flex justify-between items-start">
        {/* التاريخ في أقصى اليسار */}
        <span className="text-xs text-gray-500">
          {comment.timestamp}
        </span>

        {/* مجموعة معلومات المستخدم */}
        <div className="flex items-center gap-3 pb-2">
          {/* الاسم واسم المستخدم */}
          <div className="text-right">
            <h4 className="font-medium text-gray-900">{userInfo.fullName}</h4>
            <div className="flex items-center justify-end mt-1 gap-1">
              <span className="text-xs text-gray-500">@{userInfo.id}</span>
              <FaInfoCircle className="text-gray-400" size={10} />
            </div>
          </div>

          {/* الأيقونة في أقصى اليمين */}
          <div>
            <CustomIcon
              icon={userInfo.iconName}
              iconColor={userInfo.iconColor}
              bgColor={userInfo.bgColor}
              size={14}
            />
          </div>
        </div>
      </div>

      {/* نص التعليق */}
      <div className="mt-2" dir="rtl">
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

      {/* أزرار التفاعل */}
      <div className="flex mt-3 text-gray-500 justify-end gap-3">
        <button
          onClick={handleLike}
          className={`flex items-center ${userVote === 'up' ? 'text-green-600' : 'hover:text-blue-600'}`}
        >
          <FaArrowUp className="ml-1" />
          <span className="text-xs mr-1">{comment.likes}</span>
        </button>
        <button
          onClick={handleDislike}
          className={`flex items-center ${userVote === 'down' ? 'text-red-600' : 'hover:text-red-600'}`}
        >
          <FaArrowDown className="ml-1" />
        </button>
        <button
          onClick={handleReport}
          className="flex items-center hover:text-gray-600"
          title="الإبلاغ عن التعليق"
        >
          <FaFlag className="mr-2" />
          <span className="text-xs mr-1">إبلاغ</span>
        </button>
      </div>
    </div>
  );
};

export default Comment;