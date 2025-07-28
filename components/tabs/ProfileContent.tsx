import React from 'react';
import UserFormComponent from "../UserFormComponent";
import { UserInfo } from '../../types/types';
const ProfileContent = () => {
  const handleSubmit = (userData: UserInfo) => {
    console.log('بيانات المستخدم:', userData);
    // هنا يمكنك إرسال البيانات إلى الخادم
    // مثال باستخدام fetch:
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="container mx-auto p-4">
      <UserFormComponent onSubmit={handleSubmit} />
    </div>
  );
};
export default ProfileContent;