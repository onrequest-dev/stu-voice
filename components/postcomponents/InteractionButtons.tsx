import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaArrowUp, FaArrowDown, FaEye, FaComment, FaShare 
} from 'react-icons/fa';
import Alert from '../Alert';

interface InteractionButtonsProps {
  postId: string;
  onAgree: () => void;
  onDisagree: () => void;
  onShare?: () => void; // جعلناها اختيارية
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
        
        // استدعاء onShare إذا كانت موجودة
        if (onShare) onShare();
      })
      .catch(() => {
        setAlertMessage('فشل نسخ الرابط، يرجى المحاولة مرة أخرى');
        setAlertType('error');
        setShowAlert(true);
      });
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-500 text-sm">
            <FaEye className="ml-1" size={14} />
            <span>{readersCount}</span>
          </div>
          
          <Link 
            href={`/posts/${postId}`} 
            className="flex items-center text-blue-500 text-sm hover:underline"
          >
            <FaComment className="ml-1" size={14} />
            <span>{commentsCount}</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleShare}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            title="مشاركة"
          >
            <FaShare size={14} />
          </button>
          
          <div className="flex items-center">
            <button 
              onClick={onAgree}
              className={`p-1.5 rounded-full ${agreed === true ? 'bg-green-50 text-green-600' : 'text-gray-500'} hover:bg-green-50 transition-colors`}
            >
              <FaArrowUp size={14} />
            </button>
            <span className="mx-1.5 text-sm text-gray-600">{agreeCount}</span>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={onDisagree}
              className={`p-1.5 rounded-full ${agreed === false ? 'bg-red-50 text-red-600' : 'text-gray-500'} hover:bg-red-50 transition-colors`}
            >
              <FaArrowDown size={14} />
            </button>
            <span className="mx-1.5 text-sm text-gray-600">{disagreeCount}</span>
          </div>
        </div>
      </div>

      {/* عرض التنبيه */}
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