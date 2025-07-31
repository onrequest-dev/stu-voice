'use client';
import React, { useState } from 'react';
import PostCreator from '../postcomponents/PostCreator';
import PostComponent from '../postcomponents/PostComponent';
import { PostProps, UserInfo, } from '../postcomponents/types';

const NewPostContent = () => {
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
  try {
    // تجهيز البيانات للإرسال للـ API
    const bodyPayload = {
      post: postData.content.opinion ?? '',
      topics: '', // يمكنك تعديلها حسب الحاجة
      poll: postData.content.poll
        ? {
            title: postData.content.poll.question,
            options: postData.content.poll.options,
          }
        : undefined,
    };

    const response = await fetch('/api/opinions/makeopinion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // لإرسال الكوكيز مثل JWT
      body: JSON.stringify(bodyPayload),
    });

    const result = await response.json();
    console.log('Post creation result:', result); 

    if (!response.ok) {
      // التعامل مع الخطأ إن وجد
      alert(result.error || 'حدث خطأ أثناء إنشاء المنشور');
      return;
    }

    // بناء المنشور الجديد محلياً بعد نجاح الإضافة
    const newPost: PostProps = {
      id: `post-${Date.now()}`, // أو يمكنك استخدام result.post[0].id لو متاح
      userInfo: postData.isAnonymous
        ? {
            id: 'anonymous',
            fullName: 'مجهول',
            iconName: 'user-secret',
            iconColor: '#6b7280',
            bgColor: '#9ca3af',
            study: ""
          }
        : userInfo,
      opinion: postData.content.opinion
        ? {
            text: postData.content.opinion,
            agreeCount: 0,
            disagreeCount: 0,
            readersCount: 0,
            commentsCount: 0,
          }
        : null,
      poll: postData.content.poll
        ? {
            question: postData.content.poll.question,
            options: postData.content.poll.options,
            votes: Array(postData.content.poll.options.length).fill(0),
            durationInDays: postData.content.poll.durationInDays,
          }
        : null,
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
  } catch (error) {
    console.error('Error submitting post:', error);
    alert('فشل في إرسال المنشور. حاول مرة أخرى.');
  }
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

export default NewPostContent;