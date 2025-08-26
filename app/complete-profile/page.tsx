'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import UserFormComponent from "@/components/UserFormComponent";
import Alert from "@/components/Alert";
import { UserInfo } from "@/types/types";

const Page = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [message,setmessage] = useState<string|null>(null);
  const [src,setsrc] = useState<string|null>(null);


  const router = useRouter();

  
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const Message = params.get('message');
    const Src = params.get('src');
    if(Message) setmessage(Message);
    if(Src) setsrc(Src);

  },[])

  // عرض alert عند تحميل الصفحة إذا كانت هناك رسالة في الرابط
  useEffect(() => {
    if (message) {
      setAlertMessage(decodeURIComponent(message));
      setAlertType('info');
      setShowAlert(true);
    }
  }, [message]);

  const handleSubmit = async (userData: UserInfo) => {

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
          setAlertMessage('تم تحديث البيانات بنجاح!');
          setAlertType('success');
          setShowAlert(true);

          // تحويل بعد 2 ثانية (تغيير المدة حسب رغبتك)
          setTimeout(() => {
            if (src) {
              if (src.startsWith('http')) {
                window.location.href = src;
              } else {
                router.push(src);
              }
            }
          }, 300);
        } catch (error) {
          setAlertType('error');
          setShowAlert(true);
        }
      } else {
        console.error('فشل الطلب: ', data);
        setAlertMessage(data.message || ' لم يتم تحديث البيانات عليك الانتظار اسبوع من آخر تعديل قمت به');
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
