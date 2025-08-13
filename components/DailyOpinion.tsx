'use client';
import { useState, useRef, useEffect } from 'react';
import { FaRegComment, FaArrowUp } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import Comment from './postcomponents/Comment/Comment';
import { UserInfo } from './postcomponents/types';

interface DailyOpinionProps {
  opinion: {
    id: string;
    type: 'ترفيهي' | 'أكاديمي' | 'اجتماعي';
    text: string;
    agreeCount: number;
    disagreeCount: number;
    readersCount: number;
  };
  initialComments: {
    id: string;
    text: string;
    likes: number;
    timestamp: string;
    userInfo: UserInfo;
    userLiked?: boolean;
  }[];
}

const DailyOpinion = ({ opinion, initialComments }: DailyOpinionProps) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [userReaction, setUserReaction] = useState<'agree' | 'disagree' | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentUser: UserInfo = {
    id: 'current-user',
    fullName: 'أنت',
    iconName: 'user',
    iconColor: '#ffffff',
    bgColor: '#3b82f6',
    study: 'طالب'
  };

  // إنشاء بيانات المستخدمين (usersData)
  const usersData = {
    [currentUser.id]: currentUser,
    ...initialComments.reduce((acc, comment) => {
      acc[comment.userInfo.id] = comment.userInfo;
      return acc;
    }, {} as Record<string, UserInfo>)
  };

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(progress);
        setShowScrollButton(scrollTop > 100);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment,
        likes: 0,
        timestamp: 'الآن',
        userInfo: currentUser,
        userLiked: false
      };
      
      setComments([...comments, comment]);
      setNewComment('');
      inputRef.current?.focus();
    }
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const wasLiked = comment.userLiked;
        return {
          ...comment,
          likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
          userLiked: !wasLiked
        };
      }
      return comment;
    }));
  };

  const handleDislike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const wasLiked = comment.userLiked;
        return {
          ...comment,
          likes: wasLiked ? comment.likes - 1 : comment.likes,
          userLiked: false
        };
      }
      return comment;
    }));
  };

  const handleReaction = (reaction: 'agree' | 'disagree') => {
    setUserReaction(userReaction === reaction ? null : reaction);
  };

  const handleAddReply = (replyText: string, parentCommentId: string) => {
    // يمكنك تنفيذ هذه الوظيفة حسب احتياجاتك
    console.log('تمت إضافة رد:', replyText, 'للتعليق:', parentCommentId);
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      let progress = scrollProgress;
      const animateScroll = () => {
        progress -= 2;
        setScrollProgress(progress > 0 ? progress : 0);
        if (progress > 0) {
          requestAnimationFrame(animateScroll);
        }
      };
      requestAnimationFrame(animateScroll);
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Opinion Card */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            {/* Opinion Type */}
            <div className="flex justify-between items-center mb-3">
              <span className={`text-xs px-3 py-1 rounded-full ${
                opinion.type === 'ترفيهي' ? 'bg-purple-100 text-purple-800' :
                opinion.type === 'أكاديمي' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {opinion.type}
              </span>
              <span className="text-sm text-gray-500">
                {opinion.readersCount} قارئ
              </span>
            </div>

            {/* Opinion Text */}
            <p className="text-gray-800 text-right text-lg mb-4">
              {opinion.text}
            </p>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <div className="flex justify-end items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaRegComment className="ml-2" />
                التعليقات ({comments.length})
              </h2>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map(comment => (
                <Comment
                  key={comment.id}
                  comment={{
                    id: comment.id,
                    text: comment.text,
                    likes: comment.likes,
                    timestamp: comment.timestamp,
                    repliesCount: 0 // يمكنك تغيير هذا حسب احتياجاتك
                  }}
                  userInfo={comment.userInfo}
                  onLike={() => handleLike(comment.id)}
                  onDislike={() => handleDislike(comment.id)}
                  currentUser={currentUser}
                  usersData={usersData}
                  onAddReply={handleAddReply}
                  charLimit={170}
                />
              ))}
              <div ref={commentsEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scroll Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed left-4 bottom-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
          aria-label="التمرير إلى الأعلى"
        >
          <div className="relative w-full h-full">
            {/* Progress Circle */}
            <svg className="w-full h-full absolute top-0 left-0 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - scrollProgress / 100)}
              />
            </svg>
            {/* Arrow Icon */}
            <FaArrowUp className="text-gray-700 text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </button>
      )}

      {/* Comment Input */}
      <div className="fixed bottom-1 left-0 right-0 bg-white pb-1 pl-3 pr-3">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="...اكتب تعليقك"
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={`p-2 rounded-full ${newComment.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} shadow-sm`}
          >
            <IoMdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyOpinion;