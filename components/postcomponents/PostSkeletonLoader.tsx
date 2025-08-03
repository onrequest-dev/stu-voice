import React from 'react';

const PostSkeletonLoader: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 animate-pulse" dir="rtl">
      {/* رأس المنشور */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
        <div className="flex-1 mx-3 text-right">
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 float-right"></div>
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>

      {/* محتوى المنشور */}
      <div className="space-y-2 mb-4 text-right">
        <div className="h-4 w-5/6 bg-gray-200 rounded mr-auto"></div>
        <div className="h-4 w-4/6 bg-gray-200 rounded mr-auto"></div>
      </div>

      {/* أزرار التفاعل */}
      <div className="flex justify-between items-center pt-3">
        <div className="flex space-x-4 space-x-reverse">
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex space-x-4 space-x-reverse">
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeletonLoader;