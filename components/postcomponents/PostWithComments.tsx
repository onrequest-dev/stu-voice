'use client';
import { useState, useEffect, useRef } from 'react';
import { FaArrowRight, FaExclamationTriangle, FaRegComment, FaHeart, FaRegHeart } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import PostComponent from './PostComponent';
import Comment from './Comment';
import { UserInfo, Opinion, Poll, PostProps } from './types';
import Link from 'next/link';
import CommentRulesAlert from './CommentRulesAlert';

interface CommentType {
  id: string;
  userId: string;
  text: string;
  likes: number;
  timestamp: string;
  userLiked?: boolean;
}

interface PostWithCommentsProps {
  postData: PostProps;
  commentsData: {
    comments: CommentType[];
    users: Record<string, UserInfo>;
  };
}

const PostWithComments = ({ postData, commentsData }: PostWithCommentsProps) => {
  const [comments, setComments] = useState<CommentType[]>(commentsData.comments);
  const [users] = useState(commentsData.users);
  const [newComment, setNewComment] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isManualTrigger, setIsManualTrigger] = useState(false);
  const [alertClosedPermanently, setAlertClosedPermanently] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const closedPermanently = localStorage.getItem('commentAlertClosed') === 'true';
    setAlertClosedPermanently(closedPermanently);
    
    if (!closedPermanently) {
      setShowAlert(true);
    }
  }, []);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const currentUser = {
        id: 'currentUser',
        iconName: 'user',
        iconColor: '#ffffff',
        bgColor: '#3b82f6',
        fullName: 'أنت',
        study: ''
      };
      
      const comment: CommentType = {
        id: Date.now().toString(),
        userId: 'currentUser',
        text: newComment,
        likes: 0,
        timestamp: 'الآن',
        userLiked: false
      };
      
      setComments([comment, ...comments]);
      users['currentUser'] = currentUser;
      setNewComment('');
      
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
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

  const handleAlertClose = (permanent = false) => {
    if (permanent) {
      localStorage.setItem('commentAlertClosed', 'true');
      setAlertClosedPermanently(true);
    }
    setShowAlert(false);
    setIsManualTrigger(false);
  };

  const handleShowAlert = () => {
    setShowAlert(true);
    setIsManualTrigger(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen relative">
      {/* Header ثابت دائما */}
      <div className="sticky top-0 z-50 p-4 border-b bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <Link 
            href="/taps/HomeContent" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowRight className="ml-1 transform rotate-180" />
            <span className="hidden sm:inline">العودة للمنشورات</span>
          </Link>
          
          <button
            onClick={handleShowAlert}
            className="flex items-center text-red-600 hover:text-red-800 transition-colors"
          >
            <FaExclamationTriangle className="ml-1" />
            <span className="hidden sm:inline">شروط التعليق</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-b">
        <PostComponent 
          id={postData.id}
          userInfo={postData.userInfo}
          opinion={postData.opinion}
          poll={postData.poll}
        />
      </div>

      <div className="p-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <div></div> {/* عنصر فارغ لملء المساحة */}
          <h2 className="text-lg font-semibold text-gray-800 flex items-center" dir="rtl">
            <FaRegComment className="ml-2" />
            <span>التعليقات ({comments.length})</span>
          </h2>
        </div>
        
        <div className="space-y-4 mb-4">
          {comments.map(comment => {
            const user = users[comment.userId];
            return (
              <Comment
                key={comment.id}
                comment={comment}
                userInfo={user}
                onLike={() => handleLike(comment.id)}
                onDislike={() => handleLike(comment.id)}
              />
            );
          })}
        </div>
      </div>

      {/* حقل التعليق الثابت في الأسفل للهواتف */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 shadow-lg md:relative md:border-t-0 md:shadow-none md:p-0 md:bg-transparent">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-right"
            placeholder="أضف تعليقك..."
            rows={1}
            style={{ minHeight: '50px', maxHeight: '120px' }}
            dir="rtl"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={`p-3 rounded-full ${newComment.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            <IoMdSend size={20} />
          </button>
        </div>
      </div>

      {showAlert && (
        <CommentRulesAlert 
          isManualTrigger={isManualTrigger} 
          onClose={handleAlertClose} 
        />
      )}
    </div>
  );
};

export default PostWithComments;