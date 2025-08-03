import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaArrowUp, FaArrowDown, FaEye, FaComment, FaShare, FaFlag,
  FaTimes, FaTwitter, FaFacebook, FaWhatsapp, FaTelegram, FaLink
} from 'react-icons/fa';
import Alert from '../Alert';

interface InteractionButtonsProps {
  postId: string;
  onAgree: () => void;
  onDisagree: () => void;
  onShare?: () => void;
  onReport?: () => void;
  agreeCount: number;
  disagreeCount: number;
  readersCount: number;
  commentsCount?: number;
  agreed: boolean | null;
}

const InteractionButtons: React.FC<InteractionButtonsProps> = ({
  postId,
  onAgree,
  onDisagree,
  onShare,
  onReport,
  agreeCount,
  disagreeCount,
  readersCount,
  commentsCount = 0,
  agreed
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/posts/${postId}`;
    
    // المحاولة الأولى: استخدام Web Share API (للهواتف)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'منشور مثير للاهتمام',
          text: 'شاهد هذا المنشور الرائع',
          url: shareUrl,
        });
        if (onShare) onShare();
        return;
      } catch (error) {
        console.log('تم إلغاء المشاركة');
        // لا تفعل شيء إذا ألغى المستخدم
      }
    }
    
    // المحاولة الثانية: عرض لوحة المشاركة المخصصة
    setShowSharePanel(true);
  };

  const handleSocialShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/posts/${postId}`;
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('شاهد هذا المنشور الرائع')}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`شاهد هذا المنشور الرائع: ${shareUrl}`)}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('شاهد هذا المنشور الرائع')}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            setAlertMessage('تم نسخ الرابط بنجاح!');
            setAlertType('success');
            setShowAlert(true);
            setShowSharePanel(false);
          })
          .catch(() => {
            setAlertMessage('فشل نسخ الرابط');
            setAlertType('error');
            setShowAlert(true);
          });
        return;
      default:
        return;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowSharePanel(false);
    if (onShare) onShare();
  };

  const handleReport = () => {
    if (onReport) {
      onReport();
      setAlertMessage('تم الإبلاغ عن المنشور بنجاح');
    } else {
      setAlertMessage("شكراً لحفاظك على سلامة المنصة 🌹، سيتم مراجعة الإبلاغ");
    }
    setAlertType('info');
    setShowAlert(true);
  };

  return (
    <>
      <div className="flex justify-between items-center px-3 py-4 md:px-4 md:py-6">
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="flex items-center text-gray-500 text-xs md:text-sm">
            <FaEye className="ml-1 mr-1.5" size={12} />
            <span>{readersCount}</span>
          </div>
          
          <Link 
            href={`/posts/${postId}`} 
            className="flex items-center text-blue-500 text-xs md:text-sm hover:underline"
          >
            <FaComment className="ml-1 mr-1.5" size={12} />
            <span>{commentsCount}</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-4">
          <button 
            onClick={handleReport}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            title="إبلاغ"
          >
            <FaFlag size={12} />
          </button>
          
          <button 
            onClick={handleShare}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            title="مشاركة"
          >
            <FaShare size={12} />
          </button>
          
          <div className="flex items-center">
            <button 
              onClick={onAgree}
              className={`p-1 rounded-full ${agreed === true ? 'bg-green-50 text-green-600' : 'text-gray-500'} hover:bg-green-50 transition-colors`}
            >
              <FaArrowUp size={12} />
            </button>
            <span className="mx-1 text-xs md:text-sm text-gray-600">{agreeCount}</span>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={onDisagree}
              className={`p-1 rounded-full ${agreed === false ? 'bg-red-50 text-red-600' : 'text-gray-500'} hover:bg-red-50 transition-colors`}
            >
              <FaArrowDown size={12} />
            </button>
            <span className="mx-1 text-xs md:text-sm text-gray-600">{disagreeCount}</span>
          </div>
        </div>
      </div>

      {/* لوحة المشاركة المخصصة */}
      {showSharePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-md animate-slide-up">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">مشاركة المنشور</h3>
              <button 
                onClick={() => setShowSharePanel(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <FaTimes size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 p-4">
              {/* واتساب */}
              <button 
                onClick={() => handleSocialShare('whatsapp')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="bg-[#25D366] text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
                  <FaWhatsapp size={20} />
                </div>
                <span className="text-xs">واتساب</span>
              </button>
              
              {/* فيسبوك */}
              <button 
                onClick={() => handleSocialShare('facebook')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="bg-[#1877F2] text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
                  <FaFacebook size={20} />
                </div>
                <span className="text-xs">فيسبوك</span>
              </button>
              
              {/* تويتر */}
              <button 
                onClick={() => handleSocialShare('twitter')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="bg-[#1DA1F2] text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
                  <FaTwitter size={20} />
                </div>
                <span className="text-xs">تويتر</span>
              </button>
              
              {/* تلغرام */}
              <button 
                onClick={() => handleSocialShare('telegram')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="bg-[#0088CC] text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
                  <FaTelegram size={20} />
                </div>
                <span className="text-xs">تلغرام</span>
              </button>
              
              {/* نسخ الرابط */}
              <button 
                onClick={() => handleSocialShare('copy')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors col-span-4 mt-2"
              >
                <div className="bg-gray-600 text-white p-3 rounded-full mb-2 w-12 h-12 flex items-center justify-center">
                  <FaLink size={20} />
                </div>
                <span className="text-xs">نسخ الرابط</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <Alert 
          message={alertMessage}
          type={alertType}
          autoDismiss={3000}
          onDismiss={() => setShowAlert(false)}
        />
      )}
    </>
  );
};

export default InteractionButtons;