'use client';
import { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import UserInfoComponent from './UserInfoComponent';
import OpinionComponent from './OpinionComponent';
import PollComponent from './PollComponent';
import Comment from './Comment';
import { UserInfo, Opinion, Poll } from './types';
import Link from 'next/link';

interface CommentType {
  id: string;
  userId: string;
  text: string;
  likes: number;
  timestamp: string;
}

interface PostWithCommentsProps {
  postData: {
    id: string;
    userInfo: UserInfo;
    opinion?: Opinion | null;
    poll?: Poll | null;
  };
  commentsData: {
    comments: CommentType[];
    users: Record<string, UserInfo>;
  };
}

const PostWithComments = ({ postData, commentsData }: PostWithCommentsProps) => {
  const [comments, setComments] = useState(commentsData.comments);
  const [users] = useState(commentsData.users);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const currentUser = { // يمكن استبدالها بمعلومات المستخدم الحالي
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
        timestamp: 'الآن'
      };
      
      setComments([...comments, comment]);
      users['currentUser'] = currentUser;
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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
      {/* زر العودة */}
      <div className="p-4 border-b flex items-center">
        <Link href="/taps/HomeContent" className="flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowRight className="ml-1 transform rotate-180" />
          <span>العودة للمنشورات</span>
        </Link>
      </div>

      {/* محتوى المنشور */}
      <div className="p-4 border-b">
        <UserInfoComponent userInfo={postData.userInfo} />
        
        {postData.opinion && <OpinionComponent opinion={postData.opinion} />}
        {postData.poll && <PollComponent poll={postData.poll} />}
      </div>

      {/* قسم التعليقات */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          التعليقات ({comments.length})
        </h2>
        
        {/* نموذج إضافة تعليق جديد */}
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أضف تعليقك..."
            rows={3}
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            نشر التعليق
          </button>
        </div>
        
        {/* قائمة التعليقات */}
        <div className="space-y-4">
          {comments.map(comment => {
            const user = users[comment.userId];
            return (
              <Comment
                key={comment.id}
                comment={comment}
                userInfo={user}
                onLike={() => handleLike(comment.id)}
                onDislike={() => handleDislike(comment.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PostWithComments;