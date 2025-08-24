'use client';
import { useState } from 'react';
import UserFormComponent from "@/components/UserFormComponent";
import Alert from "@/components/Alert"; // تأكد من المسار الصحيح للمكون
import { UserInfo } from "@/types/types";

const Page = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('error');

  const handleSubmit = async (userData: UserInfo) => {
    console.log('بيانات المستخدم:', userData);

    try {
      const response = await fetch('/api/auth/editinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        try {
          localStorage.setItem('userInfo', JSON.stringify(userData));
          console.log('تم حفظ بيانات المستخدم في localStorage');
          
          // عرض تنبيه نجاح (اختياري)
          setAlertMessage('تم تحديث البيانات بنجاح!');
          setAlertType('success');
          setShowAlert(true);
        } catch (error) {
          console.error('فشل حفظ بيانات المستخدم في localStorage', error);
          setAlertMessage('فشل حفظ البيانات محلياً');
          setAlertType('error');
          setShowAlert(true);
        }
      } else {
        console.error('فشل الطلب: ', data);
        setAlertMessage(data.message || ' لم يتم تحديث البيانات عليك الانتظار اسبوع من آخر تعديل قمت به' );
        setAlertType('error');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('حدث خطأ أثناء إرسال البيانات:', error);
      setAlertMessage('حدث خطأ في الاتصال بالخادم');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      {showAlert && (
        <Alert 
          message={alertMessage}
          type={alertType}
          autoDismiss={5000}
          onDismiss={() => setShowAlert(false)}
        />
      )}
      <UserFormComponent onSubmit={handleSubmit} />
    </div>
  );
};

export default Page;