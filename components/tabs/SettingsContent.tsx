import React from 'react';
import UserFormComponent from "../UserFormComponent";
import { UserInfo } from '../../types/types';

const SettingsContent = () => {
    const handleSubmit = (userData: UserInfo) => {
      console.log('بيانات المستخدم:', userData);
      // هنا يمكنك إرسال البيانات إلى الخادم
      // مثال باستخدام fetch:
      fetch('/api/auth/editinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      .then(response => response.json())
      .then(data => {
         try {
      localStorage.setItem('userInfo', JSON.stringify(userData));
    } catch (error) {
      console.error('فشل حفظ بيانات المستخدم في localStorage', error);
    }
        console.log('Success:', data)}
      )
      .catch(error => console.error('Error:', error));
    };
  
    return (
      <div className="container mx-auto p-4">
        <UserFormComponent onSubmit={handleSubmit} />
      </div>
    );
};
export default SettingsContent;