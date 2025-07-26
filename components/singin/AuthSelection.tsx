import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AuthSelection: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden p-4">
      {/* الزخارف الدائرية */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100 rounded-full opacity-30"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-200 rounded-full opacity-20"></div>
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-blue-300 rounded-full opacity-10"></div>
      
      {/* البطاقة الرئيسية */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl z-10 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* قسم الصورة المعدل */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-64 flex items-center justify-center relative p-6">
          {/* الزخارف داخل مكان الصورة */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-24 h-24 bg-white opacity-15 rounded-full"></div>
          
          {/* الصورة المعدلة بحجم أكبر */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <Image
              src="/stu-voice.png"
              alt="StuVoice Logo"
              width={320}  // زيادة عرض الصورة
              height={200} // زيادة ارتفاع الصورة
              className="object-contain drop-shadow-lg" // إضافة ظل وتحسين العرض
              priority    // لجعل الصورة أولوية في التحميل
            />
          </div>
        </div>

        {/* محتوى المكون (يبقى كما هو) */}
        <div className="p-8 space-y-6 relative">
          {/* زخارف صغيرة */}
          <div className="absolute -top-6 right-6 w-12 h-12 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute bottom-10 left-4 w-8 h-8 bg-blue-200 rounded-full opacity-15"></div>
          
          <h1 className="text-3xl font-bold text-center text-gray-800">!مرحباً بك</h1>
          <p className="text-gray-600 text-center">
            اختر أحد الخيارات للبدء في رحلتك معنا
          </p>

          {/* أزرار التنقل */}
          <div className="space-y-4 pt-2">
            <Link 
              href="/sign-up" 
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              إنشاء حساب جديد
            </Link>
            
            <Link 
              href="/log-in" 
              className="block w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg text-center transition duration-300 transform hover:-translate-y-1 hover:shadow-md"
            >
              لدي حساب بالفعل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSelection;