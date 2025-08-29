'use client';
import React, { useEffect, useState } from 'react';
import TabbedContainer from '../TabbedProfileORPosts';
import { UserInfo } from '@/types/types';
import { PostProps } from '../postcomponents/types';
import { getUserDataFromStorageAll } from '@/client_helpers/userStorageAll';

const ProfileContent = () => {
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب البيانات من localStorage عند تحميل المكون
    const data = getUserDataFromStorageAll();
    setUserData(data);
    
    // إنشاء منشورات افتراضية
    const defaultPosts = generateDefaultPosts(data);
    setPosts(defaultPosts);
    
    setLoading(false);
  }, []);

  // دالة لإنشاء منشورات افتراضية
  const generateDefaultPosts = (userData: UserInfo | null): PostProps[] => {
    if (!userData) return [];
    
    return [
    //   {
    //     id: '1',
    //     userInfo:{
    //         id: 'user-001',
    //         iconName: 'user',
    //         iconColor: '#3B82F6',
    //         bgColor: '#EFF6FF',
    //         fullName: 'أحمد محمد',
    //         study: 'هندسة البرمجيات'
    //       },
    //     opinion: {
    //       text: "أعتقد أن التعلم المستمر هو مفتاح النجاح في مجال التكنولوجيا. يجب علينا دائمًا أن نطور من مهاراتنا ونواكب أحدث التقنيات.",
    //       agreeCount: 24,
    //       disagreeCount: 3,
    //       readersCount: 156,
    //       commentsCount: 7
    //     },
    //     createdAt: "2023-10-15T14:30:00Z",
    //     showDiscussIcon: true
    //   },
    //   {
    //     id: '2',
    //     userInfo:{
    //         id: 'user-001',
    //         iconName: 'user',
    //         iconColor: '#3B82F6',
    //         bgColor: '#EFF6FF',
    //         fullName: 'أحمد محمد',
    //         study: 'هندسة البرمجيات'
    //       },
    //     poll: {
    //       question: "ما هو إطار العمل الذي تفضل استخدامه في مشاريعك؟",
    //       options: ["React", "Vue", "Angular", "Svelte"],
    //       votes: [42, 28, 15, 10],
    //       durationInDays: 7
    //     },
    //     createdAt: "2023-10-10T09:15:00Z",
    //     showDiscussIcon: true
    //   },
    //   {
    //     id: '3',
    //     userInfo:{
    //         id: 'user-001',
    //         iconName: 'user',
    //         iconColor: '#3B82F6',
    //         bgColor: '#EFF6FF',
    //         fullName: 'أحمد محمد',
    //         study: 'هندسة البرمجيات'
    //       },
    //     opinion: {
    //       text: "تجربة المستخدم هي العامل الأهم في نجاح أي تطبيق. حتى لو كان التطبيق يعمل بشكل ممتاز تقنيًا، فإن واجهة مستخدم سيئة ستؤدي إلى فقدان المستخدمين.",
    //       agreeCount: 37,
    //       disagreeCount: 5,
    //       readersCount: 218,
    //       commentsCount: 12
    //     },
    //     createdAt: "2023-10-05T16:45:00Z",
    //     showDiscussIcon: true
    //   },
    //   {
    //     id: '4',
    //     userInfo:{
    //         id: 'user-001',
    //         iconName: 'user',
    //         iconColor: '#3B82F6',
    //         bgColor: '#EFF6FF',
    //         fullName: 'أحمد محمد',
    //         study: 'هندسة البرمجيات'
    //       },
    //     poll: {
    //       question: "ما هي لغة البرمجة التي تعتزم تعلمها العام القادم؟",
    //       options: ["TypeScript", "Python", "Rust", "Go", "Kotlin"],
    //       votes: [35, 40, 18, 15, 12],
    //       durationInDays: 10
    //     },
    //     createdAt: "2023-09-28T11:20:00Z",
    //     showDiscussIcon: true
    //   }
     ];
  };

  // إذا كانت البيانات still loading
  if (loading) {
    return <></>;
  }

  // إذا لم توجد بيانات
  if (!userData) {
    return <div className="text-center py-10">لا توجد بيانات مستخدم</div>;
  }

  // إرسال البيانات للمكون TabbedContainer
  return <TabbedContainer userData={userData} posts={posts} />;
};

export default ProfileContent;