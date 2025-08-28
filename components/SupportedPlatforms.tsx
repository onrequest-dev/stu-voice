'use client';
import React, { useState } from 'react';
import { 
  FaGlobe, 
  FaLaptopCode 
} from 'react-icons/fa';
import Image from 'next/image';
interface Platform {
  name: string;
  description: string;
  url: string;
  type: string;
  icon?: React.ReactNode;
  features?: string[];
  image?: string; // رابط صورة المنصة
}

const PlatformCard: React.FC<Platform> = ({ 
  icon, 
  name, 
  description, 
  url,
  type,
  image
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      window.open(url, '_blank');
      setTimeout(() => setIsClicked(false), 600);
    }, 300);
  };

  return (
    <div 
      className="relative w-80 h-96 perspective-1000 cursor-pointer mb-10 mx-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* تأثير إشعاعي خلف البطاقة */}
      <div className={`absolute -inset-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl opacity-20 blur-xl transition-all duration-700 ${isHovered ? 'opacity-30 scale-110' : ''}`}></div>
      
      {/* البطاقة الرئيسية */}
      <div className={`relative w-full h-full transition-all duration-500 ${isHovered ? 'transform scale-105' : ''} ${isClicked ? 'animate-ping' : ''}`}>
        {/* واجهة البطاقة */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-between border-4 border-white overflow-hidden">
          
          {/* زخرفة SVG علوية */}
          <svg className="absolute top-0 right-0 w-24 h-24 opacity-10 text-blue-500" viewBox="0 0 100 100">
            <path d="M0,0 L100,0 L100,100 Z" fill="currentColor" />
          </svg>
          
          {/* زخرفة SVG سفلية */}
          <svg className="absolute bottom-0 left-0 w-24 h-24 opacity-10 text-blue-400" viewBox="0 0 100 100">
            <path d="M0,100 L0,0 L100,100 Z" fill="currentColor" />
          </svg>
        
          
          {/* صورة أو أيقونة */}
          <div className="relative z-10 text-5xl mt-2 text-blue-600 transition-all duration-500 transform">
          {image ? (
            <Image
              src={image} 
              alt={name} 
              width={96} 
              height={96} 
              loading="lazy" 
              className="w-24 h-24 object-cover rounded-full shadow-md"
            />
          ) : (
            icon
          )}
          </div>
          
          {/* محتوى البطاقة */}
          <div className="flex flex-col items-center justify-center flex-grow z-10">
            <h3 className="text-2xl font-bold mb-2 text-center text-gray-800 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {name}
            </h3>
            
            <div className="inline-block px-3 py-1 mb-4 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {type}
            </div>
            
            <p className="text-gray-600 text-center leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* زر زيارة المنصة */}
          <button className={`relative z-10 mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 transform ${isHovered ? 'scale-110 shadow-xl' : ''}`}>
            زيارة المنصة
          </button>
        </div>
      </div>
    </div>
  );
};

const SupportedPlatforms: React.FC = () => {
  const platforms: Platform[] = [
    {
      name: "ECL",
      description: "منصة تدعم طلاب الشهادات وتوفر بحثاً مرناً وتصفحاً وتحميلاً سلساً للملفات",
      url: "https://ecl-onrequest.vercel.app/",
      type: "موقع إلكتروني",
      icon: <FaLaptopCode />,
      image:"/ecl_logo.png"
    },
  ];

  const defaultIcon = <FaGlobe />;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            المنصات <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">المدعومة</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اكتشف مجموعة المنصات التعليمية التي نقدمها لدعم مسيرتك التعليمية
          </p>
        </div>

        {/* شبكة البطاقات */}
        <div className="flex flex-wrap justify-center -mx-4">
          {platforms.map((platform, index) => (
            <PlatformCard
              key={index}
              name={platform.name}
              description={platform.description}
              url={platform.url}
              type={platform.type}
              icon={platform.icon || defaultIcon}
              image={platform.image} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportedPlatforms;