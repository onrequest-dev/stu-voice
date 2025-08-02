'use client';
import { useState, useRef, useEffect } from 'react';
import { FaExclamationTriangle, FaRegComment, FaHeart, FaRegHeart, FaEllipsisH } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { FiArrowLeft } from 'react-icons/fi';
import Comment from './postcomponents/Comment';
import { UserInfo } from './postcomponents/types';

interface DailyOpinionProps {
  opinion: {
    id: string;
    type: 'ترفيهي' | 'أكاديمي' | 'اجتماعي';
    text: string;
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
  const [showAlert, setShowAlert] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUser: UserInfo = {
    id: 'current-user',
    fullName: 'أنت',
    iconName: 'user',
    iconColor: '#ffffff',
    bgColor: '#3b82f6',
    study: 'طالب'
  };

  useEffect(() => {
    const handleScroll = () => {
      if (commentsRef.current) {
        setIsScrolled(commentsRef.current.scrollTop > 50);
      }
    };

    const ref = commentsRef.current;
    ref?.addEventListener('scroll', handleScroll);
    return () => ref?.removeEventListener('scroll', handleScroll);
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
      setComments([comment, ...comments]);
      setNewComment('');
      
      // Scroll to top after adding new comment
      setTimeout(() => {
        commentsRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
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
    // يمكنك تنفيذ وظيفة dislike هنا إذا كنت بحاجة إليها
    // حالياً نستخدم نفس handleLike ولكن بالإشارة إلى أن المستخدم لم يعجبه
    console.log('Dislike comment:', commentId);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* شريط الرأي اليومي - ثابت أعلى الصفحة */}
      <div className={`sticky top-0 z-20 bg-white shadow-sm p-4 border-b transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-xl font-bold text-gray-800">الرأي اليومي STUvoice</h1>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mb-2 flex justify-between items-start">
            <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
              opinion.type === 'ترفيهي' ? 'bg-purple-100 text-purple-800' :
              opinion.type === 'أكاديمي' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {opinion.type}
            </span>
            
            {!showAlert && (
              <button 
                onClick={() => setShowAlert(true)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="إظهار التنبيه"
              >
                <FaExclamationTriangle size={16} />
              </button>
            )}
          </div>
          
          <p className="text-gray-800 text-right text-lg leading-relaxed">
            {opinion.text}
          </p>
        </div>
      </div>

      {/* قسم التعليقات مع scroll خاص */}
      <div 
        ref={commentsRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {showAlert && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                <FaExclamationTriangle />
                إرشادات التعليق
              </h3>
              <button 
                onClick={() => setShowAlert(false)}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                فهمت، شكرًا
              </button>
            </div>
            <ul className="text-xs text-blue-700 space-y-1 pr-4">
              <li className="relative before:content-['•'] before:absolute before:right-0">الالتزام بأدب الحوار واحترام الآخرين</li>
              <li className="relative before:content-['•'] before:absolute before:right-0">عدم استخدام ألفاظ مسيئة أو عنصرية</li>
              <li className="relative before:content-['•'] before:absolute before:right-0">يمكنك الإبلاغ عن أي تعليق مسيء</li>
            </ul>
          </div>
        )}

        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            <FaRegComment className="inline ml-2" />
            التعليقات ({comments.length})
          </h2>
        </div>

        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="relative group">
              <Comment
                comment={{
                  id: comment.id,
                  text: comment.text,
                  likes: comment.likes,
                  timestamp: comment.timestamp
                }}
                userInfo={comment.userInfo}
                onLike={() => handleLike(comment.id)}
                onDislike={() => handleDislike(comment.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* حقل إضافة تعليق - ثابت أسفل الصفحة */}
      <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="شاركنا رأيك..."
            className="flex-1 border border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            aria-label="إضافة تعليق جديد"
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
    </div>
  );
};

export default DailyOpinion;