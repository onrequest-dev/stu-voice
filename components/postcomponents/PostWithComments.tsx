'use client';
import { useState } from 'react';
import { FaUser, FaComment, FaShare, FaArrowUp, FaArrowDown, FaTimes,FaFacebook,FaTwitter,FaWhatsapp } from 'react-icons/fa';

interface Comment {
  id: string;
  user: string;
  text: string;
  likes: number;
  timestamp: string;
}

const PostWithComments = ({ postId }: { postId: string }) => {
  // حالة إدارة العرض (منشور/تعليقات/مشاركة)
  const [view, setView] = useState<'post' | 'comments' | 'share'>('post');
  
  // حالة التعليقات
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'أحمد محمد',
      text: 'هذا المنشور رائع جداً!',
      likes: 5,
      timestamp: 'منذ ساعتين'
    },
    {
      id: '2',
      user: 'سارة علي',
      text: 'شكراً على المشاركة المفيدة',
      likes: 3,
      timestamp: 'منذ ساعة'
    }
  ]);
  
  // حالة التعليق الجديد
  const [newComment, setNewComment] = useState('');

  // معالجة إضافة تعليق
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: 'أنت', // أو اسم المستخدم الحقيقي
        text: newComment,
        likes: 0,
        timestamp: 'الآن'
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white">
      {/* شريط التحكم */}
      <div className="flex border-b p-3">
        <button 
          onClick={() => setView('post')} 
          className={`px-4 py-2 ${view === 'post' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          المنشور
        </button>
        <button 
          onClick={() => setView('comments')} 
          className={`px-4 py-2 ${view === 'comments' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          التعليقات ({comments.length})
        </button>
        <button 
          onClick={() => setView('share')} 
          className={`px-4 py-2 ${view === 'share' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          مشاركة
        </button>
      </div>

      {/* محتوى المنشور */}
      {view === 'post' && (
        <div className="p-4">
          <div className="flex items-start mb-4">
            <div className="bg-gray-200 rounded-full p-2 mr-3">
              <FaUser size={20} />
            </div>
            <div>
              <h3 className="font-bold">اسم المستخدم</h3>
              <p className="text-gray-500 text-sm">@username</p>
            </div>
          </div>
          
          <p className="text-gray-800 mb-4">
            هذا محتوى المنشور الرئيسي الذي سيعرض هنا مع كل التفاصيل الخاصة به...
          </p>
          
          <div className="flex justify-between text-gray-500">
            <button className="flex items-center">
              <FaArrowUp className="mr-1" /> 24
            </button>
            <button className="flex items-center">
              <FaArrowDown className="mr-1" /> 2
            </button>
            <button 
              onClick={() => setView('comments')}
              className="flex items-center"
            >
              <FaComment className="mr-1" /> {comments.length} تعليق
            </button>
            <button 
              onClick={() => setView('share')}
              className="flex items-center"
            >
              <FaShare className="mr-1" /> مشاركة
            </button>
          </div>
        </div>
      )}

      {/* قسم التعليقات */}
      {view === 'comments' && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">التعليقات</h2>
            <button 
              onClick={() => setView('post')}
              className="text-gray-500"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="أضف تعليقك..."
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              نشر التعليق
            </button>
          </div>
          
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                <div className="flex items-start">
                  <div className="bg-gray-200 rounded-full p-2 mr-3">
                    <FaUser size={16} />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-bold">{comment.user}</h4>
                      <span className="text-gray-500 text-sm mr-2">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="mt-1">{comment.text}</p>
                    <div className="flex mt-2 text-gray-500">
                      <button className="flex items-center mr-4">
                        <FaArrowUp className="mr-1" /> {comment.likes}
                      </button>
                      <button className="flex items-center">
                        <FaArrowDown className="mr-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* قسم المشاركة */}
      {view === 'share' && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">مشاركة المنشور</h2>
            <button 
              onClick={() => setView('post')}
              className="text-gray-500"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2">رابط المنشور</label>
            <div className="flex">
              <input
                type="text"
                value={`https://example.com/posts/${postId}`}
                readOnly
                className="flex-1 border rounded-lg p-2"
              />
              <button
                onClick={() => navigator.clipboard.writeText(`https://example.com/posts/${postId}`)}
                className="bg-gray-100 border rounded-lg px-4 mr-2"
              >
                نسخ
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <button className="p-3 bg-blue-100 rounded-lg">
              <FaFacebook className="text-blue-600 mx-auto" size={24} />
              <span className="text-sm mt-1">فيسبوك</span>
            </button>
            <button className="p-3 bg-blue-50 rounded-lg">
              <FaTwitter className="text-blue-400 mx-auto" size={24} />
              <span className="text-sm mt-1">تويتر</span>
            </button>
            <button className="p-3 bg-green-100 rounded-lg">
              <FaWhatsapp className="text-green-500 mx-auto" size={24} />
              <span className="text-sm mt-1">واتساب</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostWithComments;