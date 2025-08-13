'use client';
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-3">
      <div className="relative w-12 h-12">
        {/* الحلقة الخارجية */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        {/* الحلقة الداخلية */}
        <div className="absolute inset-2 rounded-full border-4 border-blue-300 border-b-transparent animate-spin-reverse"></div>
      </div>
      <span className="text-gray-600 text-sm">جارٍ تحميل البيانات...</span>
    </div>
  );
};

export default LoadingSpinner;