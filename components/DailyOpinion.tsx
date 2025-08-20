'use client';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { FaRegComment, FaArrowUp } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import Comment from './postcomponents/Comment/Comment';
import { UserInfo } from './postcomponents/types';
import { getUserDataFromStorage } from '../client_helpers/userStorage';
import styles from '../ScrollableArea.module.css';
interface DailyOpinionProps {
  opinion: {
    id: string;
    type: 'ترفيهي' | 'أكاديمي' | 'اجتماعي';
    text: string;
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

  const commentsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = useState<UserInfo>({
    id: 'loading-user',
    fullName: 'جار التحميل...',
    iconName: 'user',
    iconColor: '#cccccc',
    bgColor: '#f0f0f0',
    study: ''
  });

  useEffect(() => {
    const loadUserData = () => {
      const userData = getUserDataFromStorage();
      if (userData) {
        setCurrentUser({
          id: userData.id,
          fullName: userData.fullName,
          iconName: userData.iconName,
          iconColor: userData.iconColor,
          bgColor: userData.bgColor,
          study: userData.study
        });
      } else {
        setCurrentUser({
          id: 'guest-' + Math.random().toString(36).substr(2, 9),
          fullName: 'زائر',
          iconName: 'user',
          iconColor: '#3b82f6',
          bgColor: '#ffffff',
          study: 'زائر'
        });
      }
    };

    loadUserData();
  }, []);

  const usersData = {
    [currentUser.id]: currentUser,
    ...initialComments.reduce((acc, comment) => {
      acc[comment.userInfo.id] = comment.userInfo;
      return acc;
    }, {} as Record<string, UserInfo>)
  };

  useEffect(() => {
    if (comments.length > initialComments.length) {
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [comments, initialComments.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop } = containerRef.current;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;

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
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
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

  const handleAddReply = async (replyText: string, parentCommentId: string, repliedToUserId?: string) => {
  if (!replyText.trim() || !currentUser) return;

  const reply = {
    id: Date.now().toString(),
    text: replyText,
    likes: 0,
    timestamp: 'الآن',
    userInfo: currentUser,
    userLiked: false,
    parentId: parentCommentId
    // يمكنك لاحقاً استخدام repliedToUserId إن احتجته
  };

  setComments(prevComments => [...prevComments, reply]);
};


  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto px-4">
      {/* Opinion Card */}
      <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
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

        <p className="text-gray-800 text-right text-lg mb-2">
          {opinion.text}
        </p>
      </div>

      {/* Comments Section */}
      <div 
        ref={containerRef}
        className={`mb-2 overflow-y-auto ${styles.scrollContainer}`}
      >
        <div className="flex justify-between items-center mb-4 mt-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaRegComment className="ml-2" />
            التعليقات ({comments.length})
          </h2>
        </div>

        <div className="space-y-4 mr-2">
          {comments.map(comment => (
            <Comment
              key={comment.id}
              comment={{
                id: comment.id,
                text: comment.text,
                likes: comment.likes,
                timestamp: comment.timestamp,
                repliesCount: 0
              }}
              userInfo={comment.userInfo}
              // onLike={() => handleLike(comment.id)}
              // onDislike={() => console.log('dis')}
              currentUser={currentUser}
              usersData={usersData}
              onAddReply={handleAddReply}
              // charLimit={170}
            />
          ))}
          <div ref={commentsEndRef} className="h-4" />
        </div>
      </div>

      {/* Comment Input */}
      <div className="border-t border-gray-200 p-2 bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="...اكتب تعليقك"
            className="flex-1 border border-gray-300 rounded-full py-2 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right shadow-sm"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={`p-2 rounded-full ${
              newComment.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-500'
            } shadow-sm transition-colors duration-200`}
          >
            <IoMdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyOpinion;