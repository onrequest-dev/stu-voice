'use client';
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { FaDatabase, FaAlignLeft} from 'react-icons/fa';
import { UserInfo } from '../types/types';
import { PostProps } from './postcomponents/types';
import UserProfileComponent from './UserProfileComponent';
import PostComponent from './postcomponents/Posts/PostComponent'; // استيراد مكون المنشور
import Link from 'next/link';
import NoComplet from './NoComplet';
// تحديث الواجهة لتشمل خاصية posts
interface TabbedContainerProps {
  userData?: UserInfo | null;
  posts?: PostProps[]; // خاصية جديدة لمصفوفة المنشورات
}

const TabbedContainer: React.FC<TabbedContainerProps> = ({ 
  userData: propUserData, 
  posts = [] // قيمة افتراضية مصفوفة فارغة
}) => {
    const [activeTab, setActiveTab] = useState<'data' | 'posts'>('data');
    const [indicatorStyle, setIndicatorStyle] = useState({ left: '0%', width: '50%' });
    const [userData, setUserData] = React.useState<UserInfo | null>(propUserData || null);
    const tabsRef = useRef<HTMLDivElement>(null);

    // تحديث موضع المؤشر عند تغيير التبويب
    useEffect(() => {
        const newPosition = activeTab === 'data' ? '0%' : '50%';
        setIndicatorStyle({
        left: newPosition,
        width: '50%',
        });
    }, [activeTab]);

    if (!userData) {
        return ;
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
              {userData.fullName===''? (<div className='mt-20' ><NoComplet/></div>):
                (<div className="flex items-center m-5 mt-20">
                    <UserProfileComponent userData={userData} /> 
                </div>)}

            </div>
            
            <div
            className={`absolute inset-0 transition-opacity duration-300 ${
                activeTab === 'posts' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            >
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-4">
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostComponent 
                        key={post.id}
                        id={post.id}
                        userInfo={post.userInfo}
                        opinion={post.opinion}
                        poll={post.poll}
                        createdAt={post.createdAt}
                        showDiscussIcon={post.showDiscussIcon}
                      />
                    ))}
                  </div>
                ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-6">
                  {/* النص */}
                  <p className="text-lg font-medium">لا توجد منشورات</p>

                  {/* زر إنشاء منشور */}
                  <Link 
                    href="/taps/NewPostContent" 
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    قم بإنشاء أول منشور لك
                  </Link>
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    );
};

export default TabbedContainer;