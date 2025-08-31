'use client';
import React, { useState, useEffect } from 'react';
import { 
  FaShareAlt, FaTimes, 
  FaWhatsapp, FaFacebook, FaTwitter, FaTelegram, FaLink 
} from 'react-icons/fa';

type Platform = 'whatsapp' | 'facebook' | 'twitter' | 'telegram' | 'copy';

const ShareButton: React.FC = () => {
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // التحكم بالظهور والإخفاء عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSocialShare = (platform: Platform) => {
    const url = currentUrl;
    let shareLink = '';

    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('تم نسخ الرابط');
        return;
      default:
        return;
    }

    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* الزر العائم */}
      <div
        className={`fixed top-1 left-14 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setShowSharePanel(true)}
          className="w-10 h-10 bg-blue-200 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="مشاركة"
        >
          <FaShareAlt className="text-lg" />
        </button>
      </div>

      {/* نافذة المشاركة */}
      {showSharePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-scale-in">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">مشاركة الصفحة الشخصية</h3>
              <button 
                onClick={() => setShowSharePanel(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 p-6">
              <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="bg-[#25D366] text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
                  <FaWhatsapp size={20} />
                </div>
                <span className="text-xs">واتساب</span>
              </button>

              <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="bg-[#1877F2] text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
                  <FaFacebook size={20} />
                </div>
                <span className="text-xs">فيسبوك</span>
              </button>

              <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="bg-[#1DA1F2] text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
                  <FaTwitter size={20} />
                </div>
                <span className="text-xs">تويتر</span>
              </button>

              <button onClick={() => handleSocialShare('telegram')} className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="bg-[#0088CC] text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
                  <FaTelegram size={20} />
                </div>
                <span className="text-xs">تلغرام</span>
              </button>

              <button onClick={() => handleSocialShare('copy')} className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors col-span-4 mt-2">
                <div className="bg-gray-600 text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
                  <FaLink size={20} />
                </div>
                <span className="text-xs">نسخ الرابط</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
