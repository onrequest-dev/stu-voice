'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signupUser } from '@/client_helpers/signup';
import { getClientFingerprint } from '@/client_helpers/getfingerprint';
import { redirect } from 'next/navigation';

const SignUpHero = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);


  // حساب قوة كلمة المرور
    const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength; 
    };


  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      // setMessage({ text: 'كلمتا المرور غير متطابقتين', type: 'error' });
      return;
    }

    const fingerprint  = await getClientFingerprint();
    console.log('Fingerprint data:', fingerprint);
    const result = await signupUser(formData.username, formData.password, fingerprint);
    console.log(result);
    if (result.success) {
      // setMessage({ text: result.message, type: 'success' });
      setFormData({ username: '', password: '', confirmPassword: '' }); // مسح النموذج بعد النجاح
      setPasswordStrength(0);
      let redirectUrl = new URLSearchParams(window.location.search).get('redirect');
      if (redirectUrl) {
        window.open(redirectUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = '/';
      }
    } else {
      // setMessage({ text: result.message, type: 'error' });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden p-4">
      {/* الزخارف الدائرية الكبيرة */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-15 -z-10"></div>
      <div className="absolute top-1/3 right-20 w-64 h-64 bg-blue-300 rounded-full opacity-10 -z-10"></div>
      
      {/* زخارف صغيرة إضافية */}
      <div className="absolute top-20 left-1/4 w-16 h-16 bg-blue-100 rounded-full opacity-25 -z-10"></div>
      <div className="absolute bottom-28 right-1/3 w-24 h-24 bg-blue-200 rounded-full opacity-20 -z-10"></div>

      {/* البطاقة الرئيسية */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl z-10 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* قسم الصورة الموسع */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-64 flex items-center justify-center relative p-8">
          {/* زخارف داخل قسم الصورة */}
          <div className="absolute top-8 left-8 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-8 right-8 w-28 h-28 bg-white opacity-15 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full"></div>
          
          {/* الصورة الأكبر والأوضح */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <Image
              src="/stu-voice.png"
              alt="StuVoice Logo"
              width={400}  // زيادة حجم الصورة
              height={250}
              className="object-contain drop-shadow-xl" // ظل أكثر وضوحًا
              quality={100} // أعلى جودة للصورة
              priority
            />
          </div>
        </div>

        {/* محتوى النموذج */}
        <div className="p-8 space-y-6 relative">
          {/* زخارف صغيرة داخل البطاقة */}
          <div className="absolute -top-6 right-6 w-14 h-14 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute bottom-6 left-6 w-10 h-10 bg-blue-200 rounded-full opacity-15"></div>
          
          <h1 className="text-3xl font-bold text-center text-gray-800">إنشاء حساب جديد</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
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
              {/* شريط قوة كلمة المرور */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className={`h-2.5 rounded-full ${
                    passwordStrength < 2 ? 'bg-red-500' :
                    passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                قوة كلمة المرور: {['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً','رائعة القوة' ][passwordStrength]}
                </p>
            </div>

            {/* تأكيد كلمة المرور */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">!كلمة المرور غير متطابقة</p>
              )}
            </div>

            {/* زر التسجيل */}
            <button
              type="submit"
              disabled={passwordStrength < 3 || formData.password !== formData.confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
            >
              تسجيل
            </button>
          </form>

          {/* رابط تسجيل الدخول */}
          <p className="text-center text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link href="/log-in"  className="text-blue-600 hover:text-blue-800 font-medium">
              سجل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpHero;