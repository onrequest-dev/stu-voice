import Link from 'next/link';

const NoComplet = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
      <div className="mb-4">
        <svg 
          className="w-16 h-16 mx-auto text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        لم يتم العثور على بيانات المستخدم
      </h3>
      <p className="text-gray-600 mb-6">
        يرجى إكمال بياناتك الشخصية للمتابعة
      </p>
      
      <Link
        href="/complete-profile?src=/taps/NewPostContent"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        استكمال البيانات
      </Link>
    </div>
  );
};

export default NoComplet;