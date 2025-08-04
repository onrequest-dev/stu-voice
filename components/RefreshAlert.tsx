// components/RefreshAlert.tsx
import React from 'react';
import { FaRedo } from 'react-icons/fa';

const RefreshAlert = ({ onRefresh }: { onRefresh: () => void }) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  const handleHardRefresh = () => {
    setIsRefreshing(true);
    
    // مسح ذاكرة التخزين المؤقت
    if (window.caches) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // مسح sessionStorage و localStorage إذا لزم الأمر
    sessionStorage.clear();
    
    // إعادة تحميل الصفحة مع تجاوز الكاش
    window.location.reload();
  };

  return (
    <>
      {/* الزر العائم */}
      <button
        onClick={handleHardRefresh}
        className="fixed bottom-6 left-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        aria-label="Refresh page"
      >
        <FaRedo className={`text-xl ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>

      {/* التنبيه الأصلي */}
      <div className="p-4 mb-6 text-center bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-indigo-800 font-medium mb-2">لا توجد منشورات أخرى حالياً</h3>
        <p className="text-indigo-600 mb-3">قد يكون هناك محتوى جديد متاح الآن</p>
        <button
          onClick={handleHardRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          تحديث الصفحة
        </button>
      </div>
    </>
  );
};

export default RefreshAlert;