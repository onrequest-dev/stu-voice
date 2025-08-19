'use client';
import { FaArrowUp, FaArrowDown, FaFlag, FaInfoCircle, FaReply } from 'react-icons/fa';
import CustomIcon from '../CustomIcon';
import { UserInfo } from '../types';
import { useState } from 'react';
import Alert from '../../Alert';
import CommentReplies from './CommentReplies';
import { TextExpander } from '../../TextExpander';
import ReportComponent from '@/components/ReportComponent';
interface CommentProps {
  comment: {
    id: string;
    text: string;
    likes: number;
    timestamp: string;
    repliesCount?: number;
  };
  userInfo: UserInfo;
  onLike: () => void;
  onDislike: () => void;
  charLimit?: number;
  currentUser: UserInfo;
  usersData: Record<string, UserInfo>;
  onAddReply: (replyText: string, parentCommentId: string, repliedToUserId?: string) => void;
}

const Comment = ({ 
  comment, 
  userInfo, 
  // onLike, 
  // onDislike, 
  currentUser,
  usersData,
  onAddReply
}: CommentProps) => {
  // const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  // const handleLike = () => {
  //   if (userVote === 'up') {
  //     setUserVote(null);
  //     onDislike();
  //   } else {
  //     setUserVote('up');
  //     onLike();
  //     if (userVote === 'down') {
  //       onLike();
  //     }
  //   }
  // };

  // const handleDislike = () => {
  //   if (userVote === 'down') {
  //     setUserVote(null);
  //     onLike();
  //   } else {
  //     setUserVote('down');
  //     onDislike();
  //     if (userVote === 'up') {
  //       onDislike();
  //     }
  //   }
  // };

  const toggleReplies = () => {
    //////////////////////////////////////////////////////////حج هادي هون التعليقات الفرغية بس حطلك شي شغلة بين ما يحملوا
    setShowReplies(!showReplies);
  };

  return (
    <div className="border-b pb-4 mb-4 relative">
      {/* الصف العلوي: التاريخ ومعلومات المستخدم */}
      <div className="flex justify-between items-start">
        <span className="text-xs text-gray-500">
          {comment.timestamp}
        </span>
        <div className="flex items-center gap-3 pb-2">
          <div className="text-right">
            <h4 className="font-medium text-gray-900">{userInfo.fullName}</h4>
            <div className="flex items-center justify-end mt-1 gap-1">
              <span className="text-xs text-gray-500">@{userInfo.id}</span>
              <FaInfoCircle className="text-gray-400" size={10} />
            </div>
          </div>
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
        <TextExpander 
          text={comment.text}
          charLimit={170}
          className="text-gray-800 text-right text-sm md:text-base"
          dir="rtl"
        />
      </div>

      {/* أزرار التفاعل */}
      <div className="flex mt-3 text-gray-500 justify-end gap-3">
        {/* <button
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
        </button> */}
        <ReportComponent id={comment.id} username={userInfo.id} type="c" />

        <button
          onClick={toggleReplies}
          className="flex items-center text-gray-500 hover:text-blue-600">
          <FaReply size={12} />
          <span className="text-xs ml-2">{comment.repliesCount || 0} ردود</span>
        </button>
      </div>

      {/* زر الرد وعدد الردود */}
      {/* <div className="flex mt-2 items-center">
        <button
          onClick={toggleReplies}
          className="flex items-center text-gray-500 hover:text-blue-600"
        >
          <FaReply className="m-2" />
          <span className="text-xs">{comment.repliesCount || 0} ردود</span>
        </button>
      </div> */}

      {/* شريط الردود */}
      {showReplies && (
        <CommentReplies 
          comment={{
            id: comment.id,
            userId: userInfo.id,
            text: comment.text,
            repliesCount: comment.repliesCount || 0,
            likes: comment.likes,
            timestamp: comment.timestamp
          }}
          userInfo={userInfo}
          usersData={usersData}
          onAddReply={onAddReply}
          onClose={() => setShowReplies(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Comment;