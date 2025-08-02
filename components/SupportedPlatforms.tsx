'use client';
import React, { useState } from 'react';
import { FaExternalLinkAlt, FaGraduationCap, FaSearch, FaDownload } from 'react-icons/fa';

interface SupportedPlatformProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  features: string[];
  url: string;
}

const SupportedPlatform: React.FC<SupportedPlatformProps> = ({ 
  icon, 
  name, 
  description, 
  features,
  url 
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    
    setTimeout(() => {
      window.open(url, '_blank');
      setTimeout(() => setIsRotating(false), 500);
    }, 800);
  };

  return (
    <div 
      onClick={handleClick}
      className="relative w-72 h-96 perspective-1000 cursor-pointer"
    >
      {/* المكون الرئيسي مع تأثير الدوران */}
      <div 
        className={`relative w-full h-full transition-transform duration-700 ease-in-out ${isRotating ? 'rotate-y-180' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isRotating ? 'rotateY(180deg)' : 'rotateY(0)'
        }}
      >
        {/* الواجهة الأمامية */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-6 flex flex-col items-center backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-5xl mb-4 text-blue-600">{icon}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">{name}</h3>
          <p className="text-gray-600 text-center mb-4">{description}</p>
          
          <div className="mt-auto w-full">
            <div className="flex items-center justify-center text-blue-500 gap-2">
              <span className="text-sm font-medium">انتقال للمنصة</span>
              <FaExternalLinkAlt />
            </div>
          </div>
        </div>

        {/* الواجهة الخلفية الشفافة */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-700/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-white bg-blue-600/80 rounded-full p-4 mb-4">
            <FaGraduationCap size={28} />
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-3 text-center">مميزات {name}</h4>
          
          <ul className="space-y-2 text-gray-700 text-center">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-blue-500">
                  {feature.includes('بحث') ? <FaSearch /> : <FaDownload />}
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const SupportedPlatforms: React.FC = () => {
  const platforms = [
    {
      name: "ECL",
      description: "منصة دعم لطلاب الشهادات توفر بحثاً سهلاً وتحميلاً مرناً للملفات",
      url: "https://ecl-onrequest.vercel.app/",
      features: [
        "بحث سلس عن المواد الدراسية",
        "تحميل مرن لمختلف أنواع الملفات",
        "دعم متكامل لطلاب الشهادات",
        "واجهة مستخدم سهلة التعامل"
      ],
      icon: <FaGraduationCap />
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">المنصات المدعومة</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نقدم حلولنا المتكاملة على هذه المنصات التعليمية المتخصصة
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {platforms.map((platform, index) => (
            <SupportedPlatform
              key={index}
              name={platform.name}
              description={platform.description}
              url={platform.url}
              features={platform.features}
              icon={platform.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportedPlatforms;