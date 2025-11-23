'use client';
import { useState } from 'react';
import NewPostContent from '../STUvoiceOpinionManager';
import HomeContent from '../tabs/HomeContent';
import GovStudentMoodDashboard from './GovStudentMoodDashboard';
const tabs = [
  { id: 'decision', label: 'منشور حكومي', content: <div><NewPostContent/></div> },
  { id: 'complaints', label: 'شكاوى الطلاب', content: <div>📩 محتوى الشكاوى</div> },
  { id: 'trending', label: 'الآراء الرائجة', content: <div><HomeContent/></div> },
  { id: 'stats', label: 'الاحصائيات', content: <div><GovStudentMoodDashboard/></div> },
];

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full mt-20 px-1" dir="rtl">
      {/* شريط التبويبات */}
      <div
        className="flex overflow-x-auto gap-3 py-2"
        style={{
            scrollbarWidth: 'none',   // Firefox
            msOverflowStyle: 'none',  // IE و Edge
        }}
        >
        <style jsx>{`
            div::-webkit-scrollbar {
            display: none; /* Chrome, Safari */
            }
        `}</style>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-2 py-1 rounded-full text-sm md:text-base font-semibold transition-all duration-300 border 
              ${activeTab === tab.id
                ? 'text-white border-yellow-400 bg-green-900 shadow-md'
                : 'text-yellow-300 border-yellow-300 hover:bg-yellow-300/10'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* محتوى التبويب */}
      <div className="mt-6 rounded-lg backdrop-blur-md bg-transparent min-h-[200px]" dir='ltr'>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;
