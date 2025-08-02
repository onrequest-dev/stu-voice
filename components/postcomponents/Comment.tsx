'use client';
import { FaArrowUp, FaArrowDown, FaFlag } from 'react-icons/fa';
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
      // إلغاء الإعجاب إذا كان مضغوطاً مسبقاً
      setUserVote(null);
      onDislike(); // ننقص العدد
    } else {
      // إعجاب جديد أو تغيير من عدم إعجاب إلى إعجاب
      setUserVote('up');
      onLike(); // نزيد العدد
      // إذا كان هناك تصويت سلبي مسبقاً، ننقصه
      if (userVote === 'down') {
        onLike(); // نزيد العدد لتعويض النقص السابق
      }
    }
  };

  const handleDislike = () => {
    if (userVote === 'down') {
      // إلغاء عدم الإعجاب إذا كان مضغوطاً مسبقاً
      setUserVote(null);
      onLike(); // نزيد العدد
    } else {
      // تصويت سلبي جديد أو تغيير من إعجاب إلى عدم إعجاب
      setUserVote('down');
      onDislike(); // ننقص العدد
      // إذا كان هناك تصويت إيجابي مسبقاً، ننقصه
      if (userVote === 'up') {
        onDislike(); // ننقص العدد لتعويض الزيادة السابقة
      }
    }
  };

  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      {showReportAlert && (
        <Alert
          message="شكرا  🌹, سيتم مراجعة الابلاغ من قبل الإدارة واتخاذ الاجراء المناسب 
          شكرا لحفاظك على سلامة المنصة 😊"
          type="success"
          autoDismiss={5000}
          onDismiss={() => setShowReportAlert(false)}
        />
      )}
      
      <div className="flex items-start">
        <div className="mr-3">
          <CustomIcon 
            icon={userInfo.iconName}
            iconColor={userInfo.iconColor}
            bgColor={userInfo.bgColor}
            size={14}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">{userInfo.fullName}</h4>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">@{userInfo.id}</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {comment.timestamp}
            </span>
          </div>
          
          <p className="mt-2 text-gray-800 text-right">{comment.text}</p>
          
          <div className="flex mt-3 text-gray-500">
            <button 
              onClick={handleLike}
              className={`flex items-center mr-4 ${userVote === 'up' ? 'text-green-600' : 'hover:text-blue-600'}`}
            >
              <FaArrowUp className="mr-1" />
              <span className="text-xs">{comment.likes}</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`flex items-center mr-4 ${userVote === 'down' ? 'text-red-600' : 'hover:text-red-600'}`}
            >
              <FaArrowDown className="mr-1" />
            </button>
            <button 
              onClick={handleReport}
              className="flex items-center hover:text-gray-600"
              title="الإبلاغ عن التعليق"
            >
              <FaFlag className="mr-1" />
              <span className="text-xs">إبلاغ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;