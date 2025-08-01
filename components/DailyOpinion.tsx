'use client';
import { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
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
  }[];
}

const DailyOpinion = ({ opinion, initialComments }: DailyOpinionProps) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  const currentUser: UserInfo = {
    id: 'current-user',
    fullName: 'أنت',
    iconName: 'user',
    iconColor: '#ffffff',
    bgColor: '#3b82f6',
    study: 'student'
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment,
        likes: 0,
        timestamp: 'الآن',
        userInfo: currentUser
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 } 
        : comment
    ));
  };

  const handleDislike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: Math.max(0, comment.likes - 1) } 
        : comment
    ));
  };
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* شريط الرأي اليومي - ثابت أعلى الصفحة */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-4 border-b">
        <div className="flex justify-between items-center mb-2">
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
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-800 text-right text-lg leading-relaxed">
            <h2 className="text-xl font-bold text-blue-600">STUvoice</h2>
            <div className="mb-2">
                <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                    opinion.type === 'ترفيهي' ? 'bg-purple-100 text-purple-800' :
                    opinion.type === 'أكاديمي' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                    }`}>
                    {opinion.type}
                </span>
            </div>
            {opinion.text}
          </p>
        </div>
      </div>

      {/* قسم التعليقات - بدون شريط تمرير مرئي */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {showAlert && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-bold text-blue-800 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                إرشادات التعليق
              </h3>
              <button 
                onClick={() => setShowAlert(false)}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                فهمت، شكرًا
              </button>
            </div>
            <ul className="text-xs text-blue-700 mt-2 list-disc pr-4 space-y-1">
              <li>الالتزام بأدب الحوار واحترام الآخرين</li>
              <li>عدم استخدام ألفاظ مسيئة أو عنصرية</li>
              <li>يمكنك الإبلاغ عن أي تعليق مسيء</li>
            </ul>
          </div>
        )}

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

      {/* حقل إضافة تعليق - ثابت أسفل الصفحة */}
      <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="شاركنا رأيك..."
            className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            aria-label="إضافة تعليق جديد"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            نشر
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyOpinion;