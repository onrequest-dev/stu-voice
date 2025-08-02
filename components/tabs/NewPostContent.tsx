'use client';
import React, { useState, useEffect } from 'react';
import PostCreator from '../postcomponents/PostCreator';
import PostComponent from '../postcomponents/PostComponent';
import { PostProps, UserInfo } from '../postcomponents/types';

const NewPostContent = () => {
  const [posts, setPosts] = useState<Array<PostProps>>([]);
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = () => {
      const storedData = localStorage.getItem('userInfo');
      if (storedData) {
        try {
          const parsed: UserInfo = JSON.parse(storedData);
          setUserData(parsed);
        } catch (err) {
          console.error('فشل في قراءة بيانات المستخدم:', err);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSubmitPost = async (postData: {
    content: {
      opinion?: string;
      poll?: {
        question: string;
        options: string[];
        durationInDays: number;
      };
    };
  }) => {
    if (!userData) {
      alert('بيانات المستخدم غير متوفرة');
      return;
    }

    try {
      // تجهيز البيانات للإرسال للـ API
      const bodyPayload = {
        post: postData.content.opinion ?? '',
        topics: '',
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
        credentials: 'include',
        body: JSON.stringify(bodyPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'حدث خطأ أثناء إنشاء المنشور');
        return;
      }

      // بناء المنشور الجديد محلياً بعد نجاح الإضافة
      const newPost: PostProps = {
        id: `post-${Date.now()}`,
        userInfo: userData,
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

  if (isLoading) {
    return <div className="text-center py-10">جارٍ تحميل البيانات...</div>;
  }

  if (!userData) {
    return (
      <div className="text-center py-10">
        <p>لم يتم العثور على بيانات المستخدم</p>
        <p>الرجاء تسجيل الدخول أولاً</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <PostCreator 
        onSubmit={handleSubmitPost} 
        userInfo={userData} 
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