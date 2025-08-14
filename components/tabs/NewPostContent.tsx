'use client';
import React, { useState, useEffect } from 'react';
import PostCreator from '../postcomponents/Posts/PostCreator';
import PostComponent from '../postcomponents/Posts/PostComponent';
import { UserInfo as PostUserInfo,PostProps } from '../postcomponents/types';
import Link from 'next/link';
import { getUserDataFromStorage } from '../../client_helpers/userStorage';

const NewPostContent = () => {
  const [posts, setPosts] = useState<Array<PostProps>>([]);
  const [userData, setUserData] = useState<PostUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تأخير جلب البيانات قليلاً لمحاكاة عملية غير متزامنة
    const loadUserData = () => {
      try {
        const data = getUserDataFromStorage();
        setUserData(data);
      } catch (error) {
        console.error('Failed to load user data:', error);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    // تأخير بسيط لضمان أن يتم تحميل الصفحة أولاً
    const timer = setTimeout(loadUserData, 100);
    return () => clearTimeout(timer);
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
      const bodyPayload = {
        post: postData.content.opinion ?? '',
        topics: '',
        poll: postData.content.poll
          ? {
              title: postData.content.poll.question,
              options: postData.content.poll.options,
              durationInDays: postData.content.poll.durationInDays,
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

  if (!userData?.fullName) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
        <div className="mb-4">
          <svg 
            className="w-16 h-16 mx-auto text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          لم يتم العثور على بيانات المستخدم
        </h3>
        <p className="text-gray-600 mb-6">
          يرجى إكمال بياناتك الشخصية للمتابعة
        </p>
        
        <Link
          href="/complete-profile"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          استكمال البيانات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <PostCreator 
        onSubmit={handleSubmitPost} 
        userInfo={userData} 
      />
      
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