'use client';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import CustomIcon from './CustomIcon';
import { UserInfo } from './types';

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
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <div className="flex items-start">
        {/* أيقونة المستخدم */}
        <div className="mr-3">
          <CustomIcon 
            icon={userInfo.iconName}
            iconColor={userInfo.iconColor}
            bgColor={userInfo.bgColor}
            size={14}
          />
        </div>
        
        {/* محتوى التعليق */}
        <div className="flex-1">
          {/* معلومات المستخدم */}
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
          
          {/* نص التعليق */}
          <p className="mt-2 text-gray-800 text-right">{comment.text}</p>
          
          {/* أزرار التفاعل */}
          <div className="flex mt-3 text-gray-500">
            <button 
              onClick={onLike}
              className="flex items-center mr-4 hover:text-blue-600"
            >
              <FaArrowUp className="mr-1" />
              <span className="text-xs">{comment.likes}</span>
            </button>
            <button 
              onClick={onDislike}
              className="flex items-center hover:text-red-600"
            >
              <FaArrowDown className="mr-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;