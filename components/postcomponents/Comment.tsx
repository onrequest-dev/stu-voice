'use client';
import { FaArrowUp, FaArrowDown, FaFlag, FaInfoCircle } from 'react-icons/fa';
import CustomIcon from './CustomIcon';
import { UserInfo } from './types';
import { useState } from 'react';
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
}

const Comment = ({ comment, userInfo, onLike, onDislike }: CommentProps) => {
  const [showReportAlert, setShowReportAlert] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

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
        <div className="flex items-center gap-3"> {/* استخدمنا gap-3 للمسافة بين العناصر */}
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
      <p className="mt-2 text-gray-800 text-right">{comment.text}</p>

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
          <FaFlag className="ml-1" />
          <span className="text-xs mr-1">إبلاغ</span>
        </button>
      </div>
    </div>
  );
};

export default Comment;