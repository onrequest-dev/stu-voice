'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getClientFingerprint } from '@/client_helpers/getfingerprint';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [customerServiceNumber] = useState('920001234');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getClientFingerprint().then(fingerprint => {
      console.log('Fingerprint:', fingerprint);
    });
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
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  كلمة المرور
                </label>
                <button 
                  type="button"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
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

            {/* قسم استعادة كلمة المرور */}
            {showForgotPassword && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700 mb-2">
                  للاستعلام عن كلمة المرور، يرجى الاتصال على رقم خدمة العملاء:
                </p>
                <div className="flex items-center justify-center bg-white p-3 rounded border border-blue-200">
                  <span className="font-bold text-blue-600">{customerServiceNumber}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(customerServiceNumber)}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                    title="نسخ الرقم"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

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