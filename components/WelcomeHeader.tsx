'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowDown } from 'react-icons/fa';

const WelcomeHeader = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="relative bg-gradient-to-r from-blue-50 to-white overflow-hidden">
      {/* موجات متحركة مع التمرير */}
      <div 
        className="absolute bottom-0 left-0 right-0 overflow-hidden transition-transform duration-300"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-24">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".35" 
            className="fill-blue-200"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-blue-300"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,233.88-22.17V0Z" 
            className="fill-white"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* النص الترحيبي مع تأثيرات نصية */}
          <div className="md:w-1/2 mb-12 md:mb-0 text-center md:text-right">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
                يصنع الفرق <span className="text-blue-600 relative inline-block">
                    <span className="relative z-10">رأيك</span>
                    <span 
                    className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 opacity-80 rounded-full"
                    style={{ transform: `scaleX(${isHovered ? 1.1 : 1})` }}
                    ></span>
                </span>
            </h1>
            
            <p className="text-lg text-gray-700 max-w-lg mx-auto md:mx-0">
              منصة تجمع آراء الطلاب لتحسين تجربتهم التعليمية STUvoice
            </p>
            <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto md:mx-0 ">
              شارك  
              <span className="text-blue-600 relative inline-block ml-2 mr-2">رأيك</span>
                اليومي و ساهم في صناعة الفرق
            </p>
            <Link 
                  href="/main" // المسار النسبي الصحيح
                  passHref
                  className="relative inline-block group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="relative z-10 px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 transform group-hover:-translate-y-1 inline-flex items-center">
                    ابدأ الآن
                    <FaArrowDown className="ml-2 group-hover:rotate-180 transition-transform duration-500" />
                  </span>
                  <span 
                    className="absolute -bottom-1 left-0 w-full h-3 bg-blue-400 rounded-full opacity-70 group-hover:opacity-100 transition-all duration-300"
                    style={{ 
                      transform: `scaleX(${isHovered ? 1.2 : 1})`,
                      height: isHovered ? '4px' : '3px'
                    }}
                  ></span>
                </Link>
          </div>

          {/* العنصر المرئي مع تأثيرات */}
          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div 
                className="absolute inset-0 bg-blue-200 rounded-full opacity-20"
                style={{ 
                  transform: `scale(${isHovered ? 1.05 : 1})`,
                  transition: 'transform 0.5s ease'
                }}
              ></div>
              <div 
                className="absolute top-0 right-0 w-3/4 h-3/4 bg-blue-300 rounded-full opacity-30"
                style={{ 
                  transform: `translate(${isHovered ? '5px' : '0'}, ${isHovered ? '-5px' : '0'})`,
                  transition: 'transform 0.4s ease'
                }}
              ></div>
              <div 
                className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-blue-400 rounded-full opacity-20"
                style={{ 
                  transform: `translate(${isHovered ? '-5px' : '0'}, ${isHovered ? '5px' : '0'})`,
                  transition: 'transform 0.4s ease'
                }}
              ></div>
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-40 w-40 text-blue-600 transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* مؤشر التمرير للأسفل */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <FaArrowDown className="text-blue-600 text-xl opacity-70" />
      </div>
    </header>
  );
};

export default WelcomeHeader;