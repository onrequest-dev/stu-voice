'use client';
import React from 'react';
import { UserInfo } from '../../types/types';
import UserProfileComponent from '../UserProfileComponent';
const ProfileContent = () => {
  // يمكن جلب البيانات من localStorage أو من API
  const [userData, setUserData] = React.useState<UserInfo | null>(null);

  React.useEffect(() => {
    const storedData = localStorage.getItem('userInfo');
    if (storedData) {
      try {
        const parsed: UserInfo = JSON.parse(storedData);
        setUserData(parsed);
      } catch (err) {
        console.error('فشل في قراءة بيانات المستخدم:', err);
      }
    }
  }, []);

  if (!userData) {
    return <div className="text-center py-10">جارٍ تحميل البيانات...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfileComponent userData={userData} />
    </div>
  );
};
export default ProfileContent;