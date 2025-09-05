'use client';
import React, { useState, useEffect } from 'react';
import { 
  FaShareAlt, FaTimes, 
  FaWhatsapp, FaFacebook, FaTwitter, FaTelegram, FaLink 
} from 'react-icons/fa';
import Alert from './Alert'; // مكون التنبيه

type Platform = 'whatsapp' | 'facebook' | 'twitter' | 'telegram' | 'copy';

interface SharePanelProps {
  isOpen: boolean;
  onClose: () => void;
  link?: string;
  iconButtonClassName?: string;
  setAlertMessage: (msg: string) => void;
  setAlertType: (type: 'success' | 'error' | 'info' | 'warning') => void;
}

export const SharePanel: React.FC<SharePanelProps> = ({
  isOpen,
  onClose,
  link,
  iconButtonClassName,
  setAlertMessage,
  setAlertType,
}) => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(link ?? window.location.href);
    }
  }, [link]);

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
        onClose();
        setAlertType('success');
        setAlertMessage('تم نسخ الرابط بنجاح!');
        return;
      default:
        return;
    }

    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md animate-scale-in">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">مشاركة الصفحة الشخصية</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 p-6">
          {[
            { platform: 'whatsapp', color: 'bg-[#25D366]', icon: <FaWhatsapp size={20} />, label: 'واتساب' },
            { platform: 'facebook', color: 'bg-[#1877F2]', icon: <FaFacebook size={20} />, label: 'فيسبوك' },
            { platform: 'twitter', color: 'bg-[#1DA1F2]', icon: <FaTwitter size={20} />, label: 'تويتر' },
            { platform: 'telegram', color: 'bg-[#0088CC]', icon: <FaTelegram size={20} />, label: 'تلغرام' },
          ].map(({ platform, color, icon, label }) => (
            <button
              key={platform}
              onClick={() => handleSocialShare(platform as Platform)}
              className={iconButtonClassName ?? 'flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors'}
            >
              <div className={`${color} text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center`}>
                {icon}
              </div>
              <span className="text-xs">{label}</span>
            </button>
          ))}

          <button
            onClick={() => handleSocialShare('copy')}
            className={iconButtonClassName ?? 'flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors col-span-4 mt-2'}
          >
            <div className="bg-gray-600 text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
              <FaLink size={20} />
            </div>
            <span className="text-xs">نسخ الرابط</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ShareButtonProps {
  buttonClassName?: string;
  panelClassName?: string;
  iconButtonClassName?: string;
  offsetTop?: number;
  link?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  buttonClassName,
  iconButtonClassName,
  offsetTop,
  link
}) => {
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('success');

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

  return (
    <>
      {/* الزر العائم */}
      <div
        className={`fixed left-14 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{ top: offsetTop ?? 4 }}
      >
        <button
          onClick={() => setShowSharePanel(true)}
          className={buttonClassName ?? 'w-10 h-10 bg-blue-200 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105'}
          aria-label="مشاركة"
        >
          <FaShareAlt className="text-lg" />
        </button>
      </div>

      {/* مكون لوحة المشاركة */}
      <SharePanel
        isOpen={showSharePanel}
        onClose={() => setShowSharePanel(false)}
        link={link}
        iconButtonClassName={iconButtonClassName}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />

      {/* مكون التنبيه */}
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          autoDismiss={3000}
          onDismiss={() => setAlertMessage('')}
        />
      )}
    </>
  );
};

export default ShareButton;
