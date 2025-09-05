import Link from 'next/link';
import React, { useState } from 'react';
import {
  FaBell,
  FaBellSlash,
  FaHome,
  FaUserEdit,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaFlag,
  FaWhatsapp,
  FaTelegram,
  FaHeadset,
  FaSignOutAlt
} from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';
import InstallPWA from './InstallPwa';

const SettingsPanel = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [addPwa,setAddPwa] = useState(false);

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const addToHomeScreen = () => {
    setAddPwa(true);
  };

  const handleEditClick = () => {
    setIsNavigating(true);
  };

  return (
    <div
      dir="rtl"
      className="relative max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-4 md:p-6 "
    >
      {isNavigating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}
      {
        addPwa&&<InstallPWA/>
      }

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-right">
        الإعدادات
      </h2>

      {/* قسم إدارة الإشعارات */}
      <div className="flex justify-between items-center py-3 md:py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 md:gap-3">
          {notificationsEnabled ? (
            <FaBell className="text-blue-500" size={18} />
          ) : (
            <FaBellSlash className="text-gray-400" size={18} />
          )}
          <span className="text-sm md:text-base text-gray-700 font-medium">
            إدارة الإشعارات
          </span>
        </div>
        <button
          onClick={toggleNotifications}
          role="switch"
          aria-checked={notificationsEnabled}
          aria-label="تبديل الإشعارات"
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
            notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span className="absolute inset-0 rounded-full" />
          <span
            className={`absolute top-0.5 bottom-0.5 w-5 rounded-full bg-white shadow transition-all ${
              notificationsEnabled ? 'left-0.5' : 'right-0.5'
            }`}
          />
        </button>
      </div>

      {/* إضافة إلى الشاشة الرئيسية */}
      <div className="flex justify-between items-center py-3 md:py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 md:gap-3">
          <FaHome className="text-blue-500" size={18} />
          <span className="text-sm md:text-base text-gray-700 font-medium">
            إضافة للشاشة الرئيسية
          </span>
        </div>
        <button
          onClick={addToHomeScreen}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base"
        >
          إضافة
        </button>
      </div>

      {/* تعديل البيانات الشخصية */}
      <div className="flex justify-between items-center py-3 md:py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 md:gap-3">
          <FaUserEdit className="text-blue-500" size={18} />
          <span className="text-sm md:text-base text-gray-700 font-medium">
            تعديل البيانات
          </span>
        </div>
        <Link
          href="/complete-profile"
          onClick={handleEditClick}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
        >
          تعديل
        </Link>
      </div>

                {/* تسجيل الخروج */}
      <div className="flex justify-between items-center py-3 md:py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 md:gap-3">
          <FaSignOutAlt className="text-red-500" size={18} /> 
          <span className="text-sm md:text-base text-gray-700 font-medium">
            تسجيل الخروج
          </span>
        </div>
        <button
          onClick={() => {
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/log-in";
          }}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
        >
          خروج
        </button>
      </div>

      {/* اتصال بخدمة العملاء (الجديد) */}
      <div className="py-3 md:py-4 border-b border-gray-200">
        <div className="flex items-center mb-3 md:mb-4 gap-2">
          <FaHeadset className="text-blue-500" size={18} /> 
          <span className="text-sm md:text-base text-gray-700 font-medium">
            التواصل مع خدمة العملاء
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://wa.me/352681523130" // استبدل برقم واتساب الصحيح
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded-lg transition-colors"
          >
            <FaWhatsapp className="text-green-500" size={20} />
            <span className="text-sm font-medium">واتساب</span>
          </a>
          
          <a
            href="https://t.me/+6283139607950" // استبدل برابط تلغرام الصحيح
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg transition-colors"
          >
            <FaTelegram className="text-blue-500" size={20} />
            <span className="text-sm font-medium">تلغرام</span>
          </a>
        </div>

        <p className="mt-3 text-xs text-gray-500 text-center">
          متاح من الساعة 8 صباحاً حتى 8 مساءً (بتوقيت سوريا)
        </p>
      </div>

      {/* شروحات التفاعل */}
      <div className="py-3 md:py-4 border-b border-gray-200">
        <div className="flex items-center mb-3 md:mb-4 gap-2">
          <FaInfoCircle className="text-blue-500" size={18} />
          <span className="text-sm md:text-base text-gray-700 font-medium">
            شروحات التفاعل
          </span>
        </div>

        <ul className="space-y-2.5 md:space-y-3">
          <li className="flex items-start gap-3">
            <FaArrowUp className="text-blue-500 flex-shrink-0 mt-0.5" size={18} aria-hidden="true" />
            <div className="text-right">
              <div className="text-sm md:text-base text-gray-800 font-medium">Up</div>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                يدعم المحتوى المفيد ليراه طلاب أكثر.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <FaArrowDown className="text-blue-500 flex-shrink-0 mt-0.5" size={18} aria-hidden="true" />
            <div className="text-right">
              <div className="text-sm md:text-base text-gray-800 font-medium">Down</div>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                يقلّل ظهور المحتوى غير المفيد للطلاب.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <FaFlag className="text-blue-500 flex-shrink-0 mt-0.5" size={18} aria-hidden="true" />
            <div className="text-right">
              <div className="text-sm md:text-base text-gray-800 font-medium">إبلاغ</div>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                تنبيه الإدارة لمراجعة محتوى مخالف أو مسيء.
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* سياسة الخصوصية */}
      <div className="py-3 md:py-4">

      <Link href={"/privacy-and-terms"}>
      <span className="flex items-center gap-2 text-sm md:text-base font-medium text-blue-800">
        <FaInfoCircle className="text-blue-500" size={18} />
        سياسة الخصوصية وشروط الاستخدام
      </span>
      </Link>
      </div>
    </div>
  );
};

export default SettingsPanel;