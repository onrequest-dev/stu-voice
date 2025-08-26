"use client";

import React from "react";

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gray-100 text-center p-6">
      {/* الوجه (ميت) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        className="w-32 h-32 mb-6"
      >
        {/* الدائرة (الوجه) */}
        <circle cx="60" cy="60" r="55" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="4" />

        {/* العين اليسرى (×) */}
        <line x1="40" y1="45" x2="48" y2="53" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
        <line x1="48" y1="45" x2="40" y2="53" stroke="#374151" strokeWidth="4" strokeLinecap="round" />

        {/* العين اليمنى (×) */}
        <line x1="72" y1="45" x2="80" y2="53" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
        <line x1="80" y1="45" x2="72" y2="53" stroke="#374151" strokeWidth="4" strokeLinecap="round" />

        {/* الفم الحزين */}
        <path
          d="M40 80 Q60 65 80 80"
          stroke="#374151"
          strokeWidth="4"
          fill="transparent"
          strokeLinecap="round"
        />
      </svg>

      {/* النص */}
      <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
      <p className="text-xl font-semibold text-gray-800 mb-2">هذه الصفحة غير موجودة</p>
      <p className="text-gray-600 mb-6">
        ربما الرابط غير صحيح أو الصفحة قد تمت إزالتها.
      </p>

      {/* زر العودة */}
      <a
        href="/main"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        العودة إلى الصفحة الرئيسية
      </a>
    </div>
  );
}