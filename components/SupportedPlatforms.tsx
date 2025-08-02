'use client';
import React, { useState, useEffect } from 'react';
import { FaGraduationCap } from 'react-icons/fa';

interface SupportedPlatformProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  url: string;
  features?: string[];
}

const SupportedPlatform: React.FC<SupportedPlatformProps> = ({ 
  icon, 
  name, 
  description, 
  url 
}) => {
  const [isRotating, setIsRotating] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = () => {
    if (isRotating) return;
    
    setIsRotating(true);
    setTimeout(() => {
      window.open(url, '_blank');
      setIsRotating(false);
    }, 1000);
  };

  return (
    <div 
      onClick={handleClick}
      className="relative w-72 perspective-1000 cursor-pointer"
      style={{ height: 'fit-content' }} // ارتفاع يتناسب مع المحتوى
    >
      <div 
        className={`relative w-full transition-transform duration-1000 ease-in-out ${isRotating ? 'rotate-y-360' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isRotating ? 'rotateY(360deg)' : 'rotateY(0)',
          height: 'fit-content' // ارتفاع يتناسب مع المحتوى
        }}
      >
        {/* الواجهة الأمامية */}
        <div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col items-center backface-hidden border-2 border-gray-200 hover:border-blue-300 transition-all duration-300"
          style={{ 
            backfaceVisibility: 'hidden',
            minHeight: '200px' // حد أدنى للارتفاع
          }}
        >
          <div className="text-5xl mb-4 text-blue-600">
            {icon}
          </div>
          
          <h3 className={`text-2xl font-bold mb-2 text-center ${isBlinking ? 'text-blue-500 animate-pulse' : 'text-gray-800'}`}>
            {name}
          </h3>
          
          <p className="text-gray-600 text-center">
            {description}
          </p>
        </div>

        {/* الواجهة الخلفية الشفافة */}
        <div 
          className="absolute inset-0 bg-transparent backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            height: '100%'
          }}
        />
      </div>
    </div>
  );
};

const SupportedPlatforms: React.FC = () => {
  const platforms = [
    {
      name: "ECL",
      description: "منصة تدعم طلاب الشهادات وتوفر بحثاً مرناً وتصفحاً وتحميلاً سلساً للملفات ",
      url: "https://ecl-onrequest.vercel.app/",
      icon: <FaGraduationCap />,
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12"> 
          <h1 className="text-3xl font-bold text-gray-900 mb-3"> 
            المنصات المدعومة
          </h1>
        </div>

        <div className="flex flex-wrap justify-center gap-6"> 
          {platforms.map((platform, index) => (
            <SupportedPlatform
              key={index}
              {...platform}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportedPlatforms;