'use client';
import React, { useState } from 'react';
import PostCreator from '../postcomponents/PostCreator';
import PostComponent from '../postcomponents/PostComponent';
import { PostProps, UserInfo, } from '../postcomponents/types';

const VotesContent = () => {
  const [posts, setPosts] = useState<Array<PostProps>>([]);
  
  const userInfo: UserInfo = {
    id: 'user123',
    iconName: 'graduate',
    iconColor: '#ffffff',
    bgColor: '#4f46e5',
    fullName: 'أحمد محمد',
    study: 'طالب علوم حاسوب'
  };

  const handleSubmitPost = async (postData: {
    isAnonymous: boolean;
    content: {
      opinion?: string;
      poll?: {
        question: string;
        options: string[];
        durationInDays: number;
      };
    };
  }) => {
    const newPost: PostProps = {
      id: `post-${Date.now()}`,
      userInfo: postData.isAnonymous 
        ? { 
            ...userInfo, 
            fullName: 'مجهول',
            id: 'anonymous',
            iconName: 'user-secret',
            iconColor: '#6b7280',
            bgColor: '#9ca3af'
          } 
        : userInfo,
      opinion: postData.content.opinion 
        ? { 
            text: postData.content.opinion,
            agreeCount: 0,
            disagreeCount: 0,
            readersCount: 0,
            commentsCount: 0
          } 
        : null,
      poll: postData.content.poll 
        ? { 
            question: postData.content.poll.question,
            options: postData.content.poll.options,
            votes: Array(postData.content.poll.options.length).fill(0),
            durationInDays: postData.content.poll.durationInDays // إضافة مدة الاستطلاع
          } 
        : null
    };
    
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* استدعاء المكون المعدل */}
      <PostCreator 
        onSubmit={handleSubmitPost} 
        userInfo={userInfo} 
      />
      
      {/* عرض المنشورات */}
      <div className="mt-8 space-y-6">
        {posts.map((post) => (
          <PostComponent 
            key={post.id} 
            {...post} 
          />
        ))}
      </div>
    </div>
  );
};

export default VotesContent;