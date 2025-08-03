import Link from 'next/link';
import React, { useState } from 'react';
import { FaBell, FaBellSlash, FaHome, FaUserEdit, FaChartBar, FaArrowUp, FaArrowDown, FaFlag } from 'react-icons/fa';

const SettingsPanel = () => {
  // حالة الإشعارات
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // حالة التصويت والإبلاغ
  const [upvotes, setUpvotes] = useState(42);
  const [downvotes, setDownvotes] = useState(7);
  const [reported, setReported] = useState(false);

  // تبديل حالة الإشعارات
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  // إضافة إلى الشاشة الرئيسية
  const addToHomeScreen = () => {
    // يمكنك إضافة منطق PWA هنا
    if ('BeforeInstallPromptEvent' in window) {
      alert('اضغط على "إضافة إلى الشاشة الرئيسية" في قائمة المتصفح');
    } else {
      alert('هذه الميزة متاحة فقط في المتصفحات المدعومة');
    }
  };

  // معالجة الإبلاغ
  const handleReport = () => {
    setReported(true);
    alert('تم الإبلاغ عن المحتوى للإدارة. شكراً لمساعدتك في الحفاظ على مجتمعنا');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right">الإعدادات</h2>
      
      {/* قسم إدارة الإشعارات */}
      <div className="flex justify-between items-center py-4 border-b border-gray-200">
        <div className="flex items-center">
          {notificationsEnabled ? (
            <FaBell className="text-blue-500 ml-3" size={20} />
          ) : (
            <FaBellSlash className="text-gray-400 ml-3" size={20} />
          )}
          <span className="text-gray-700 font-medium">إدارة الإشعارات</span>
        </div>
        <button
          onClick={toggleNotifications}
          className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <span className={`inline-block w-5 h-5 transform transition-transform bg-white rounded-full shadow-md ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* إضافة إلى الشاشة الرئيسية */}
      <div className="flex justify-between items-center py-4 border-b border-gray-200">
        <div className="flex items-center">
          <FaHome className="text-blue-500 ml-3" size={20} />
          <span className="text-gray-700 font-medium">إضافة للشاشة الرئيسية</span>
        </div>
        <button
          onClick={addToHomeScreen}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          إضافة
        </button>
      </div>

      {/* تعديل البيانات الشخصية */}
      <div className="flex justify-between items-center py-4 border-b border-gray-200">
        <div className="flex items-center">
          <FaUserEdit className="text-blue-500 ml-3" size={20} />
          <span className="text-gray-700 font-medium">تعديل البيانات</span>
        </div>
        <Link
          href="/complete-profile"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          تعديل
        </Link>
      </div>

      {/* تفاعلات الموقع */}
      <div className="py-4">
        <div className="flex items-center mb-4">
          <FaChartBar className="text-blue-500 ml-3" size={20} />
          <span className="text-gray-700 font-medium">إحصائيات التفاعل</span>
        </div>
        
        <div className="flex justify-around">
          {/* تصويت إيجابي */}
          <div className="flex flex-col items-center">
            <button 
              onClick={() => setUpvotes(upvotes + 1)}
              className="p-2 rounded-full hover:bg-green-50 transition-colors"
              aria-label="موافق على الرأي"
            >
              <FaArrowUp className="text-green-500" size={24} />
            </button>
            <span className="text-gray-600 mt-1">{upvotes}</span>
            <p className="text-xs text-gray-500 mt-1 text-center">
              يساهم في رفع المنشور لمزيد من المشاهدات
            </p>
          </div>
          
          {/* تصويت سلبي */}
          <div className="flex flex-col items-center">
            <button 
              onClick={() => setDownvotes(downvotes + 1)}
              className="p-2 rounded-full hover:bg-red-50 transition-colors"
              aria-label="غير موافق على الرأي"
            >
              <FaArrowDown className="text-red-500" size={24} />
            </button>
            <span className="text-gray-600 mt-1">{downvotes}</span>
            <p className="text-xs text-gray-500 mt-1 text-center">
              يعيق انتشار المنشور للآخرين
            </p>
          </div>
          
          {/* إبلاغ */}
          <div className="flex flex-col items-center">
            <button 
              onClick={handleReport}
              disabled={reported}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${reported ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="الإبلاغ عن إساءة"
            >
              <FaFlag className={reported ? "text-red-600" : "text-gray-500"} size={24} />
            </button>
            <span className="text-xs text-gray-500 mt-1 text-center">
              {reported ? 'تم الإبلاغ' : 'إبلاغ عن إساءة'}
            </span>
            <p className="text-xs text-gray-500 mt-1 text-center">
              للإبلاغ عن محتوى غير لائق
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;