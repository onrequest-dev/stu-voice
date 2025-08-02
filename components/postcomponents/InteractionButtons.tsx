import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaArrowUp, FaArrowDown, FaEye, FaComment, FaShare, FaFlag 
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
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/posts/${postId}`;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setAlertMessage('تم نسخ رابط المنشور إلى الحافظة');
        setAlertType('success');
        setShowAlert(true);
        
        if (onShare) onShare();
      })
      .catch(() => {
        setAlertMessage('فشل نسخ الرابط، يرجى المحاولة مرة أخرى');
        setAlertType('error');
        setShowAlert(true);
      });
  };

  const handleReport = () => {
    if (onReport) {
      onReport();
      setAlertMessage('تم الإبلاغ عن المنشور بنجاح');
      } else {
      setAlertMessage("شكرا  🌹, سيتم مراجعة الابلاغ من قبل الإدارة واتخاذ الاجراء المناسب , شكرا لحفاظك على سلامة المنصة 😊");
      }
    setAlertType('info');
    setShowAlert(true);
  };

  return (
    <>
      <div className="flex justify-between items-center px-3 py-4 md:px-4 md:py-6">
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="flex items-center text-gray-500 text-xs md:text-sm">
            <FaEye className="ml-1" size={12} />
            <span>{readersCount}</span>
          </div>
          
          <Link 
            href={`/posts/${postId}`} 
            className="flex items-center text-blue-500 text-xs md:text-sm hover:underline"
          >
            <FaComment className="ml-1" size={12} />
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