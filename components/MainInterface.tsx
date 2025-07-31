'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  FaHome, 
  FaUser, 
  FaCog, 
  FaComments, 
  FaPoll, 
  FaBell, 
  FaExternalLinkAlt,
  FaBars, 
  FaTimes, 
  FaGlobeAmericas,
  FaPlusSquare
} from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';
import HomeContent from './tabs/HomeContent';
import NotificationsContent from './tabs/NotificationsContent';
import OpinionsContent from './tabs/OpinionsConten';
import ProfileContent from './tabs/ProfileContent';
import SettingsContent from './tabs/SettingsContent';
import SupportedSitesContent from './tabs/SupportedSitesContent';
import VotesContent from './tabs/VotesContent';
import NewPostContent from './tabs/NewPostContent';

interface Tab {
  id: string;
  icon: JSX.Element;
  title: string;
  isExternal?: boolean;
  href: string;
  component?: React.ComponentType;
}

const MainInterface = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const isLargeScreen = useRef(false);
  const previousPath = useRef<string | null>(null);

  // قائمة التبويبات مع المكونات المرتبطة
  const tabs: Tab[] = [
    { 
      id: 'home', 
      icon: <FaHome size={20} />, 
      title: 'الرئيسية', 
      href: '/taps/HomeContent',
      component: HomeContent
    },
    { 
      id: 'new-post', 
      icon: <FaPlusSquare size={20} />, 
      title: 'منشور جديد', 
      href: '/taps/NewPostContent',
      component: NewPostContent
    },
    { 
      id: 'opinions', 
      icon: <FaComments size={20} />, 
      title: 'آراء', 
      href: '/taps/OpinionsContent',
      component: OpinionsContent
    },
    { 
      id: 'votes', 
      icon: <FaPoll size={20} />, 
      title: 'تصويت', 
      href: '/taps/VotesContent',
      component: VotesContent
    },
    { 
      id: 'profile', 
      icon: <FaUser size={20} />, 
      title: 'الحساب الشخصي', 
      href: '/taps/ProfileContent',
      component: ProfileContent
    },
    { 
      id: 'notifications', 
      icon: <FaBell size={20} />, 
      title: 'الإشعارات', 
      href: '/taps/NotificationsContent',
      component: NotificationsContent
    },
    { 
      id: 'settings', 
      icon: <FaCog size={20} />, 
      title: 'الإعدادات', 
      href: '/taps/SettingsContent',
      component: SettingsContent
    },
    { 
      id: 'supported-sites', 
      icon: <FaGlobeAmericas size={20} />, 
      title: 'المواقع التي ندعمها', 
      href: '/taps/SupportedSitesContent',
      component: SupportedSitesContent
    },
  ];

  const checkScreenSize = () => {
    isLargeScreen.current = window.innerWidth >= 1024;
    setIsMenuOpen(isLargeScreen.current);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = () => {
    if (!isLargeScreen.current) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const handleTabClick = (href: string, isExternal?: boolean) => {
    if (!isExternal) {
      // إذا كانت نفس الصفحة الحالية، لا تفعل شيئاً
      if (pathname === href) return;
      
      // إذا كنا نعود إلى الصفحة السابقة، استخدم replace بدلاً من push
      if (href === previousPath.current) {
        router.replace(href);
      } else {
        router.push(href);
      }
      previousPath.current = pathname;
    }
    
    if (!isLargeScreen.current) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isLargeScreen.current && 
          isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target as Node) &&
          mainContentRef.current &&
          !mainContentRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // تحديد المكون الحالي بناء على المسار
  const currentTab = tabs.find(tab => pathname === tab.href);
  const CurrentComponent = currentTab?.component || HomeContent;

  return (
    <div className={`relative h-screen w-full overflow-hidden transition-colors duration-300 ${
      isMenuOpen && !isLargeScreen.current ? 'bg-gradient-to-br from-blue-50 to-blue-100' : 'bg-white'
    }`}>
      
      <div
        ref={mainContentRef}
        className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out ${
          isMenuOpen && !isLargeScreen.current ? 'rounded-r-2xl shadow-xl' : 'rounded-none'
        }`}
        style={{
          width: isLargeScreen.current ? 'calc(100% - 6rem)' : '100%',
          transformOrigin: 'left center',
          backgroundColor: 'rgba(255,255,255,0.95)',
          transform: isMenuOpen && !isLargeScreen.current ? 'perspective(1000px) rotateY(30deg) translateX(0)' : 'none',
        }}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">STUvoice</h1>
            {!isLargeScreen.current && (
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              >
                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            )}
          </div>
          
          <div 
            className="mt-8 h-[calc(100%-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
            style={{ touchAction: 'pan-y' }}
          >
            {children || <CurrentComponent />}
          </div>
        </div>
      </div>

      {isLargeScreen.current ? (
        <div 
          className="absolute top-0 right-0 h-full w-24 bg-white border-l border-gray-200 shadow-sm flex flex-col items-center py-8"
        >
          <div 
            className="h-full flex flex-col items-center space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
            style={{ touchAction: 'pan-y' }}
          >
            {tabs.map((tab) => (
              <div key={tab.id} className="flex flex-col items-center px-2">
                <button 
                  onClick={() => handleTabClick(tab.href, tab.isExternal)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all ${
                    pathname === tab.href
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  aria-label={tab.title}
                >
                  {tab.icon}
                </button>
                <span className="mt-2 text-xs text-gray-700 text-center">{tab.title}</span>
              </div>
            ))}
            {/* رابط موقع المطورين في نهاية القائمة */}
            <div className="flex flex-col items-center px-2 mt-auto">
              <a 
                href="https://hadiiik.github.io/onrequest/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all bg-purple-100 text-purple-600 hover:bg-purple-200"
                aria-label="موقع المطورين"
              >
                <FaExternalLinkAlt size={20} />
              </a>
              <span className="mt-2 text-xs text-gray-700 text-center">موقع المطورين</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={menuRef}
            className={`absolute top-0 right-0 h-full w-24 transition-all duration-500 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } z-20`}
          >
            <div 
              ref={tabsContainerRef}
              className="h-full flex flex-col items-center py-8 space-y-6 overflow-y-auto"
              style={{
                touchAction: 'pan-y',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {tabs.map((tab) => (
                <div key={tab.id} className="flex flex-col items-center px-2">
                  <button 
                    onClick={() => handleTabClick(tab.href, tab.isExternal)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all ${
                      pathname === tab.href
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                    aria-label={tab.title}
                  >
                    {tab.icon}
                  </button>
                  <span className="mt-2 text-xs text-gray-700 text-center font-medium">
                    {tab.title}
                  </span>
                </div>
              ))}
              {/* رابط موقع المطورين في نهاية القائمة */}
              <div className="flex flex-col items-center px-2 mt-auto">
                <a 
                  href="https://hadiiik.github.io/onrequest/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all bg-purple-100 text-purple-600 hover:bg-purple-200"
                  aria-label="موقع المطورين"
                >
                  <FaExternalLinkAlt size={20} />
                </a>
                <span className="mt-2 text-xs text-gray-700 text-center font-medium">
                  موقع المطورين
                </span>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-20 z-10"
              onClick={toggleMenu}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MainInterface;