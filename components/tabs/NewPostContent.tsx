'use client';
import React, { useState, useEffect } from 'react';
import PostCreator from '../postcomponents/Posts/PostCreator';
import PostComponent from '../postcomponents/Posts/PostComponent';
import { UserInfo as PostUserInfo,PostProps } from '../postcomponents/types';
import NoComplet from '../NoComplet';
import { getUserDataFromStorage } from '../../client_helpers/userStorage';
import Alert from '../Alert';

const NewPostContent = () => {
  const [posts, setPosts] = useState<Array<PostProps>>([]);
  const [userData, setUserData] = useState<PostUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
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
        <Alert
          message={result}
          type="success"
          autoDismiss={5000}
          onDismiss={() => setShowAlert(false)}/>
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
    return <NoComplet/>;
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