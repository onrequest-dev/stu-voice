import React, { useState, useEffect } from 'react';
import { 
  FaBook, 
  FaGlobe, 
  FaUniversity, 
  FaLightbulb, 
  FaUsers, 
  FaStar, 
  FaBullseye, 
  FaHandsHelping 
} from 'react-icons/fa';

const ContributionSection = () => {

const messages = [
  {
    text: "منصة STUvoice تنطلق من وعي شباب سوريا",
    icon: <FaLightbulb className="text-yellow-400" />
  },
  {
    text: "شركاء في صناعة مستقبل بلادهم",
    icon: <FaHandsHelping className="text-green-400" />
  },
  {
    text: "التعليم حجر الأساس لبناء سوريا الحديثة",
    icon: <FaBook className="text-indigo-500" />
  },
  {
    text: "نحو سوريا التطور والحضارة والنهضة العلمية",
    icon: <FaGlobe className="text-teal-500" />
  },
  {
    text: "ربط صوت الطالب بمسؤولي التعليم",
    icon: <FaUniversity className="text-purple-500" />
  },
  {
    text: "تحويل الأفكار والطموحات إلى خطوات عملية",
    icon: <FaBullseye className="text-red-400" />
  },
  {
    text: "تحديث طرق التعلم والتقييم",
    icon: <FaStar className="text-yellow-500" />
  },
  {
    text: "بناء منظومة تعليمية تواكب متطلبات العصر",
    icon: <FaUsers className="text-blue-400" />
  }
];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          <span className="text-blue-600">ساهم</span> برأيك
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative h-48 md:h-40">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="text-4xl mb-4">
                  {message.icon}
                </div>
                <p className="text-2xl md:text-3xl text-center font-medium text-gray-700 px-4" dir='rtl'>
                  {message.text}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {messages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                aria-label={`عرض الرسالة ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContributionSection;