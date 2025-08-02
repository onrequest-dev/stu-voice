// components/LoadingSpinner.tsx
'use client';

import { FaGraduationCap } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const LoadingSpinner = () => {
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // تأثير التلاشي والتكبير
      setOpacity(prev => {
        const newOpacity = prev === 1 ? 0.7 : 1;
        setScale(newOpacity === 1 ? 1.1 : 1);
        return newOpacity;
      });
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 99));
    }, 300);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <FaGraduationCap 
          size={60} 
          className="text-blue-600 transition-all duration-500"
          style={{
            opacity,
            transform: `scale(${scale}) rotate(${scale === 1.1 ? '5deg' : '0deg'})`,
            filter: `drop-shadow(0 0 10px rgba(59, 130, 246, ${opacity * 0.7}))`
          }}
        />
        <div className="mt-4 text-blue-700 font-medium text-lg animate-pulse">
          جاري التحميل...
        </div>
        <div className="mt-3 w-40 h-2 bg-blue-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
            }}
          />
        </div>
        <div className="mt-2 text-xs text-blue-500">
          {progress}% اكتمال
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;