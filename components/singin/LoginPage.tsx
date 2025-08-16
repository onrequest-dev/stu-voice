'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { loginUser } from '@/client_helpers/login';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit =  async(e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(formData.username, formData.password);
    if (result.success) {
      // setMessage({ text: result.message, type: 'success' });
      setFormData({ username: '', password: '' }); // مسح النموذج بعد النجاح
      let redirectUrl = new URLSearchParams(window.location.search).get('redirect');
      if (redirectUrl) {
        window.open(redirectUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = '/';
      }
    }
    // إرسال بيانات الدخول إلى الخادم
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden p-4">
      {/* الزخارف الدائرية الكبيرة */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute -bottom-48 -right-48 w-[32rem] h-[32rem] bg-blue-200 rounded-full opacity-15 -z-10"></div>
      <div className="absolute top-1/3 right-24 w-72 h-72 bg-blue-300 rounded-full opacity-10 -z-10"></div>
      
      {/* زخارف متوسطة الحجم */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-100 rounded-full opacity-25 -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-20 -z-10"></div>
      
      {/* زخارف صغيرة */}
      <div className="absolute top-16 left-16 w-12 h-12 bg-blue-300 rounded-full opacity-15 -z-10"></div>
      <div className="absolute bottom-20 right-20 w-10 h-10 bg-blue-400 rounded-full opacity-15 -z-10"></div>
      <div className="absolute top-32 right-32 w-8 h-8 bg-blue-500 rounded-full opacity-10 -z-10"></div>

      {/* البطاقة الرئيسية */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl z-10 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* قسم الصورة */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-48 flex items-center justify-center relative p-8">
          {/* زخارف داخلية */}
          <div className="absolute top-4 left-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-28 h-28 bg-white opacity-15 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full"></div>
          
          {/* خطوط زخرفية */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-1 h-full bg-white opacity-20"></div>
          
          {/* الصورة */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <Image
              src="/stu-voice.png"
              alt="StuVoice Logo"
              width={320}
              height={160}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* محتوى النموذج */}
        <div className="p-8 space-y-6 relative">
          {/* زخارف داخل البطاقة */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-blue-200 rounded-full opacity-15"></div>
          
          {/* نقاط زخرفية */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-blue-300 rounded-full opacity-30"></div>
          <div className="absolute bottom-8 right-8 w-3 h-3 bg-blue-400 rounded-full opacity-30"></div>

          <h1 className="text-3xl font-bold text-center text-gray-800 relative z-10">
            تسجيل الدخول
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-100 opacity-50 rounded-full"></span>
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10" dir="rtl">
            {/* حقل اسم المستخدم */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                اسم المستخدم
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
            >
              دخول
            </button>
          </form>

          {/* رابط التسجيل */}
          <p className="text-center text-sm text-gray-600">
            ليس لديك حساب؟{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
              أنشئ حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;