'use client';
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { FaDatabase, FaAlignLeft} from 'react-icons/fa';
import { UserInfo } from '../types/types';
import UserProfileComponent from './UserProfileComponent';
import LoadingSpinner from './LoadingSpinner';
import { getUserDataFromStorageAll } from '../client_helpers/userStorageAll';

const TabbedContainer = () => {
    const [activeTab, setActiveTab] = useState<'data' | 'posts'>('data');
    const [indicatorStyle, setIndicatorStyle] = useState({ left: '0%', width: '50%' });
    const [userData, setUserData] = React.useState<UserInfo | null>(null);
    const tabsRef = useRef<HTMLDivElement>(null);

    // تحميل بيانات المستخدم
     React.useEffect(() => {
    const data = getUserDataFromStorageAll();
    setUserData(data);
  }, []);

    // تحديث موضع المؤشر عند تغيير التبويب
    useEffect(() => {
        const newPosition = activeTab === 'data' ? '0%' : '50%';
        setIndicatorStyle({
        left: newPosition,
        width: '50%',
        });
    }, [activeTab]);

    if (!userData) {
        return <div className="text-center py-10"><LoadingSpinner/></div>;
    }

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg overflow-hidden">
        {/* تبويبات التنقل مع المؤشر المتحرك */}
        <div 
            ref={tabsRef}
            className="flex border-b border-gray-200 relative border-t"
        >
            {/* المؤشر المتحرك */}
            <div
            className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out"
            style={indicatorStyle}
            />
            
            <button
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'data' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('data')}
            >
            <FaDatabase className="text-lg" />
            <span className="font-medium">بياناتي</span>
            </button>
            
            <button
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'posts' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('posts')}
            >
            <FaAlignLeft className="text-lg" />
            <span className="font-medium">منشوراتي</span>
            </button>
        </div>

        {/* محتوى التبويبات مع أنيميشن التلاشي */}
        <div className="flex-1 overflow-hidden relative">
            <div
            className={`absolute inset-0 transition-opacity duration-300 ${
                activeTab === 'data' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            >
                <div className="flex items-center m-5 mt-20">
                    <UserProfileComponent userData={userData} /> 
                </div>
            </div>
            
            <div
            className={`absolute inset-0 transition-opacity duration-300 ${
                activeTab === 'posts' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            >
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <ul className="divide-y divide-gray-100">
                kl
                </ul>
            </div>
            </div>
        </div>
        </div>
    );
    };

export default TabbedContainer;