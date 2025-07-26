import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* قسم الشعار */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              {/* استبدل هذا بشعارك الفعلي */}
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">SV</span>
              </div>
              <span className="ml-2 text-2xl font-bold text-blue-800 hidden md:inline">
                STU<span className="text-black">voice</span>
              </span>
            </Link>
          </div>

          {/* روابط التنقل */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-black hover:text-blue-600 font-medium transition duration-300">
              الرئيسية
            </Link>
            <Link href="/about" className="text-black hover:text-blue-600 font-medium transition duration-300">
              عن المشروع
            </Link>
            <Link href="/surveys" className="text-black hover:text-blue-600 font-medium transition duration-300">
              الاستبيانات
            </Link>
            <Link href="/contact" className="text-black hover:text-blue-600 font-medium transition duration-300">
              اتصل بنا
            </Link>
          </nav>

          {/* أزرار المستخدم */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-300 font-medium">
              تسجيل الدخول
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-medium hidden sm:inline-block">
              إنشاء حساب
            </button>
            
            {/* زر القائمة في النسخة الموبايل */}
            <button className="md:hidden text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;