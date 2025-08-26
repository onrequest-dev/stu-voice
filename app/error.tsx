"use client";

import React from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gray-100 text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">حدث خطأ غير متوقع</h1>
      <p className="text-gray-700 mb-6 max-w-md">
        عذراً، حصل خلل غير معروف أثناء تحميل الصفحة.  
        يمكنك المحاولة مجددًا أو العودة للصفحة الرئيسية.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          إعادة المحاولة
        </button>
        <a
          href="/main"
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg shadow hover:bg-gray-300 transition"
        >
          الصفحة الرئيسية
        </a>
      </div>
    </div>
  );
}