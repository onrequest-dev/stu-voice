'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  FaHome, 
  FaUser, 
  FaCog, 
  FaComments, 
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
import NewPostContent from './tabs/NewPostContent';
import styles from '../ScrollableArea.module.css';
import NotificationIcon from './NotificationIcon';
import { NotificationProvider } from '@/hooks/NotificationContext';
import SWMessageHandler from '@/hooks/SWMessageHandler';

interface Tab {
  id: string;
  icon: JSX.Element;
  title: string;
  isExternal?: boolean;
  href: string;
  component?: React.ComponentType;
}

const HOME_SCROLL_KEY = 'HOME_SCROLL_Y';
const HOME_PATH = '/';// مستخدمة تحت بالرئيسية

const MainInterface = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState(pathname);

  const menuRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isLargeScreen = useRef(false);
  const previousPath = useRef<string | null>(null);

  // 👇 فلاغ لتفادي الحفظ المكرر
  const skipNextAutoSaveRef = useRef(false);

  // console.log('[MI] render', { pathname, activeTab, ready });

  // sync activeTab with pathname
  useEffect(() => {
    console.log('[MI] useEffect pathname -> activeTab', { oldActiveTab: activeTab, pathname });
    setActiveTab(pathname);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const tabs = useMemo<Tab[]>(() => [
    { id: 'home', icon: <FaHome size={20} />, title: 'الرئيسية', href: HOME_PATH, component: HomeContent },
    { id: 'new-post', icon: <FaPlusSquare size={20} />, title: 'منشور جديد', href: '/taps/NewPostContent', component: NewPostContent },
    { id: 'opinions', icon: <FaComments size={20} />, title: 'الرأي اليومي', href: '/DailyOpinion', component: OpinionsContent },
    { id: 'profile', icon: <FaUser size={20} />, title: 'الحساب الشخصي', href: '/taps/ProfileContent', component: ProfileContent },
    { id: 'notifications', icon: <NotificationIcon/>, title: 'الإشعارات', href: '/taps/NotificationsContent', component: NotificationsContent },
    { id: 'settings', icon: <FaCog size={20} />, title: 'الإعدادات', href: '/taps/SettingsContent', component: SettingsContent },
    { id: 'supported-sites', icon: <FaGlobeAmericas size={20} />, title: 'المنصات التي ندعمها', href: '/taps/SupportedSitesContent', component: SupportedSitesContent },
  ], []);

  const isOnHome = useCallback(() => activeTab === HOME_PATH, [activeTab]);

  const readSaved = () => {
    try {
      const raw = sessionStorage.getItem(HOME_SCROLL_KEY);
      return raw ? parseInt(raw, 10) : 0;
    } catch {
      return 0;
    }
  };

  const saveHomeScroll = useCallback((tag: string) => {
    const refOk = !!scrollAreaRef.current;
    const onHome = isOnHome() || pathname === HOME_PATH;
    if (refOk && onHome) {
      const y = scrollAreaRef.current!.scrollTop || 0;
      try {
        sessionStorage.setItem(HOME_SCROLL_KEY, String(y));
        // console.log('[MI] saveHomeScroll', { tag, saved: y, onHome, refOk });
      } catch (e) {
        // console.log('[MI] saveHomeScroll failed', { tag, e });
      }
     } //else {
    //   console.log('[MI] saveHomeScroll skipped', { tag, onHome, refOk, activeTab, pathname });
      
    // }
  }, [isOnHome, pathname, activeTab]);

  // Save when leaving /main due to any route change (links inside children, browser buttons, etc.)
  const lastPathRef = useRef<string>(pathname);
  useEffect(() => {
    const prev = lastPathRef.current;
    const next = pathname;
    // console.log('[MI] routeChange observed', { prev, next });
    if (prev === HOME_PATH && next !== HOME_PATH) {
      if (skipNextAutoSaveRef.current) {
        // console.log('[MI] skip auto save (already saved in tabClick)');
        skipNextAutoSaveRef.current = false;
      } else {
        saveHomeScroll('routeChange-leave-home');
      }
    }
    lastPathRef.current = next;
  }, [pathname, saveHomeScroll]);

  // Extra listeners to catch all navigations (popstate, pushState, replaceState)
  useEffect(() => {
    const onPop = () => {
      if (location.pathname !== HOME_PATH && lastPathRef.current === HOME_PATH) {
        if (skipNextAutoSaveRef.current) {
          // console.log('[MI] skip auto save (already saved in tabClick)');
          skipNextAutoSaveRef.current = false;
        } else {
          saveHomeScroll('popstate-leave-home');
        }
      }
    };
    window.addEventListener('popstate', onPop);

    const origPush = history.pushState;
    const origReplace = history.replaceState;
    const patch = (fn: typeof history.pushState, name: 'pushState'|'replaceState') => {
      return function patched(this: History, ...args: Parameters<typeof history.pushState>) {
        const prev = location.pathname;
        const res = fn.apply(this, args);
        const next = location.pathname;
        if (prev === HOME_PATH && next !== HOME_PATH) {
          if (skipNextAutoSaveRef.current) {
            // console.log('[MI] skip auto save (already saved in tabClick)');
            skipNextAutoSaveRef.current = false;
          } else {
            saveHomeScroll(`${name}-leave-home`);
          }
        }
        return res;
      };
    };
    // @ts-ignore
    history.pushState = patch(origPush, 'pushState');
    // @ts-ignore
    history.replaceState = patch(origReplace, 'replaceState');

    return () => {
      window.removeEventListener('popstate', onPop);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, [saveHomeScroll]);

  const restoreHomeScroll = useCallback((reason: string) => {
    if (!isOnHome()) {
      // console.log('[MI] restore skipped (not on /main)', { reason, activeTab, pathname });
      return;
    }
    let attempts = 0;
    const maxAttempts = 8;
    const tryApply = () => {
      attempts += 1;
      const ref = scrollAreaRef.current;
      if (!ref) {
        // console.log('[MI] restore attempt waiting for ref', { reason, attempts });
        if (attempts < maxAttempts) {
          requestAnimationFrame(tryApply);
        } //else {
        //   console.log('[MI] restore aborted (ref not ready)', { reason });
        // }
        return;
      }
      const y = readSaved();
      const top = isNaN(y) ? 0 : y;
      ref.scrollTop = top;
      // console.log('[MI] restore applied', { reason, attempts, top, nowTop: ref.scrollTop });
    };
    requestAnimationFrame(tryApply);
  }, [isOnHome, activeTab, pathname]);

  useEffect(() => {
    if (ready && isOnHome()) {
      // console.log('[MI] effect restore trigger', { ready, activeTab });
      restoreHomeScroll('effect-ready+home');
    }
  }, [ready, isOnHome, restoreHomeScroll, activeTab]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState !== 'visible') {
        saveHomeScroll('visibilitychange');
      }
    };
    const onBeforeUnload = () => saveHomeScroll('beforeunload');
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [saveHomeScroll]);

  const checkScreenSize = useCallback(() => {
    const large = window.innerWidth >= 1024;
    const wasLarge = isLargeScreen.current;
    isLargeScreen.current = large;
    if (large !== wasLarge) setIsMenuOpen(large);
    // console.log('[MI] checkScreenSize', { large, wasLarge });
  }, []);

  useEffect(() => {
    checkScreenSize();
    const onResize = () => checkScreenSize();
    window.addEventListener('resize', onResize);
    setReady(true);
    // console.log('[MI] initial ready set true');
    return () => window.removeEventListener('resize', onResize);
  }, [checkScreenSize]);

  const toggleMenu = useCallback(() => {
    if (!isLargeScreen.current) {
      setIsMenuOpen(prev => !prev);
    }
    // console.log('[MI] toggleMenu', { isLarge: isLargeScreen.current });
  }, []);

  const handleTabClick = useCallback((href: string, isExternal?: boolean) => {
    // console.log('[MI] handleTabClick', { href, isExternal, activeTab, pathname });

    // ✅ حفظ الموضع عند مغادرة الرئيسية إلى تبويب آخر
    if (isOnHome() && href !== HOME_PATH) {
      saveHomeScroll('tabClick-leave-home');
      skipNextAutoSaveRef.current = true; // منع الحفظ المكرر
    }

    if (!isExternal) {
      if (activeTab === href) {
        // console.log('[MI] handleTabClick: same tab, no-op');
        return;
      }
      setActiveTab(href);

      // ✅ استرجاع الموضع عند العودة للرئيسية
      if (href === HOME_PATH) {
        restoreHomeScroll('tabClick-back-home');
      }

      if (href === previousPath.current) {
        router.replace(href);
      } else {
        router.push(href);
      }
      previousPath.current = pathname;
    }
    if (!isLargeScreen.current) setIsMenuOpen(false);
  }, [activeTab, pathname, router, isOnHome, saveHomeScroll, restoreHomeScroll]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!isLargeScreen.current && 
        isMenuOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        mainContentRef.current &&
        !mainContentRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const currentTab = useMemo(() => {
    const t = tabs.find(tab => activeTab === tab.href);
    return t;
  }, [activeTab, tabs]);
  const CurrentComponent = currentTab?.component || HomeContent;

  if (!ready) {
    return (
      <NotificationProvider>
        <SWMessageHandler />
        <div className="h-screen w-full bg-white" />
      </NotificationProvider>
    );
  }

  return (
    <>
      <NotificationProvider>
        <SWMessageHandler/>
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
            transform: isMenuOpen && !isLargeScreen.current 
            ? 'perspective(700px) rotateY(27deg) translateZ(0)' 
            : 'none',
            transition: 'transform 0.35s ease-in-out',
            willChange: 'transform',
            }}
          >
            <div className="h-full"> 
              <div className="flex justify-between p-4 pb-2">
                <h1 className="text-2xl font-semibold text-gray-800 relative z-10">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                    STUvoice
                  </span>
                </h1>
                
                {!isLargeScreen.current && (
                  <button
                    onClick={toggleMenu}
                    className="p-2 text-blue-600 hover:text-blue-800 relative z-10"
                    aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
                  >
                    {isMenuOpen ? (
                      <FaTimes size={20} />
                    ) : (
                      <FaBars size={20} />
                    )}
                  </button>
                )}
              </div>
              
              <div
                ref={scrollAreaRef}
                className={`mb-2 overflow-y-auto ${styles.scrollContainer}`}
              >
                {children || (currentTab ? <CurrentComponent key={currentTab.id} /> : <HomeContent key="home" />)}
              </div>
            </div>
          </div>

          {/* القائمة اليمنية */}
          {isLargeScreen.current ? (
            <div className="absolute top-0 right-0 h-full bg-white flex items-center">
              <div className={`flex flex-col items-center space-y-6 overflow-y-auto ${styles.scrollContainer}`}>
                {tabs.map((tab) => (
                  <div key={tab.id} className="flex flex-col items-center px-2">
                    <button 
                      onClick={() => handleTabClick(tab.href, tab.isExternal)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all ${
                        activeTab === tab.href
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
                <div className="flex flex-col items-center px-2">
                  <a 
                    href="https://hadiiik.github.io/onrequest/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all bg-purple-100 text-purple-600 hover:bg-purple-200"
                    aria-label="موقع المطورين"
                    onClick={() => saveHomeScroll('external-dev-link')}
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
                          activeTab === tab.href
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
                  <div className="flex flex-col items-center px-2 mt-auto">
                    <a 
                      href="https://hadiiik.github.io/onrequest/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all bg-purple-100 text-purple-600 hover:bg-purple-200"
                      aria-label="موقع المطورين"
                      onClick={() => saveHomeScroll('external-dev-link-mobile')}
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
      </NotificationProvider>
    </>
  );
};

export default MainInterface;
