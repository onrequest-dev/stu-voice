'use client';
import React, { useEffect, useState } from 'react';
import TabbedContainer from '../TabbedProfileORPosts';
import { UserInfo } from '@/types/types';
import { PostProps } from '../postcomponents/types';
import { getUserDataFromStorageAll } from '@/client_helpers/userStorageAll';
import { transformPost } from '@/client_helpers/transformposttype';

const ProfileContent = () => {
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // جلب البيانات من localStorage
      const data = getUserDataFromStorageAll();
      setUserData(data);

      // توليد المنشورات
      const defaultPosts = await generateDefaultPosts(data);
      setPosts(defaultPosts);

      setLoading(false);
    };

    fetchData();
  }, []);

  // دالة لجلب المنشورات من API
  const generateDefaultPosts = async (userData: UserInfo | null): Promise<PostProps[]> => {
    if (!userData) return [];

    try {
      const user_id = userData.id;
      const res = await fetch(`/api/opinions/get_opinions/${user_id}`, {
        method: 'GET',
      });

      if (!res.ok) {
        return [];
      }

      const data = await res.json();
      
      return data.map(transformPost) as PostProps[];
    } catch (error) {
      return [];
    }
  };

  // عرض أثناء التحميل
  if (loading) {
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }

  // في حالة عدم وجود بيانات
  if (!userData) {
    return <div className="text-center py-10">لا توجد بيانات مستخدم</div>;
  }

  // عرض المحتوى
  return <TabbedContainer userData={userData} posts={posts} />;
};

export default ProfileContent;



