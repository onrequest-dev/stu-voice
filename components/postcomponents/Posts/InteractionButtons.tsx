import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { 
  FaArrowUp, FaArrowDown, FaComments, FaShare,
  FaTimes, FaTwitter, FaFacebook, FaWhatsapp, FaTelegram, FaLink
} from 'react-icons/fa';
import Alert from '../../Alert';
import ReportComponent from '@/components/ReportComponent';

interface InteractionButtonsProps {
  postId: string;
  userId: string;
  onAgree: () => void;
  onDisagree: () => void;
  onShare?: () => void;
  onReport?: () => void;
  agreeCount: number;
  disagreeCount: number;
  readersCount: number;
  commentsCount?: number;
  // true: عمل upvote، false: downvote، null: لا يوجد تفاعل مسجل على الخادم
  agreed: boolean | null;
  showDiscussIcon?: boolean;
}

type ReactionType = 'upvote' | 'downvote';
const LS_KEY = 'permanent_reactions';

const InteractionButtons: React.FC<InteractionButtonsProps> = ({
  postId,
  userId,
  onAgree,
  onDisagree,
  onShare,
  agreeCount,
  disagreeCount,
  readersCount,
  commentsCount = 0,
  agreed,
  showDiscussIcon=true
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const [localUpvote, setLocalUpvote] = useState(false);
  const [localDownvote, setLocalDownvote] = useState(false);
  const [upcount, setUpcount] = useState(agreeCount);
  const [downcount, setDowncount] = useState(disagreeCount);

  const initializedForPost = useRef<string | null>(null);
  const isBrowser = typeof window !== 'undefined';

  const readStoredReaction = (id: string): ReactionType | null => {
    if (!isBrowser) return null;
    try {
      const stored = window.localStorage.getItem(LS_KEY);
      if (!stored) return null;
      const reactions: Array<{ id: string; type: ReactionType }> = JSON.parse(stored);
      const existing = reactions.find(r => r.id === id);
      return existing ? existing.type : null;
    } catch {
      return null;
    }
  };

  const writeStoredReaction = (id: string, type: ReactionType | null) => {
    if (!isBrowser) return;
    try {
      const stored = window.localStorage.getItem(LS_KEY);
      let reactions: Array<{ id: string; type: ReactionType }> = stored ? JSON.parse(stored) : [];
      if (type === null) {
        reactions = reactions.filter(r => r.id !== id);
      } else {
        const idx = reactions.findIndex(r => r.id === id);
        if (idx !== -1) reactions[idx].type = type;
        else reactions.push({ id, type });
      }
      window.localStorage.setItem(LS_KEY, JSON.stringify(reactions));
    } catch {
      // ignore
    }
  };

  // إعادة ضبط الحالة عند تغيّر postId أو وصول أرقام جديدة من الخادم
  useEffect(() => {
    setUpcount(agreeCount);
    setDowncount(disagreeCount);
    setLocalUpvote(false);
    setLocalDownvote(false);
    initializedForPost.current = null;
  }, [postId, agreeCount, disagreeCount]);

  // تهيئة اللون + تصحيح العدادات مرة واحدة لكل postId
  useEffect(() => {
    if (!isBrowser) return;
    if (initializedForPost.current === postId) return;

    const stored = readStoredReaction(postId); // 'upvote' | 'downvote' | null

    // لوّن الأزرار بناءً على المخزن أو agreed
    let effective: ReactionType | null = null;
    if (stored) effective = stored;
    else if (agreed === true) effective = 'upvote';
    else if (agreed === false) effective = 'downvote';
    else effective = null;

    setLocalUpvote(effective === 'upvote');
    setLocalDownvote(effective === 'downvote');

    // تصحيح العدادات:
    // - إذا stored موجود و agreed === null => +1 للعداد الموافق (تفاعل محلي غير محتسب خادماً).
    // - إذا stored موجود و agreed موجود ومختلف => تحويل: +1 للجديد -1 للقديم.
    if (stored) {
      if (agreed === null) {
        if (stored === 'upvote') setUpcount(prev => prev + 1);
        else setDowncount(prev => prev + 1);
      } else {
        const serverType: ReactionType = agreed ? 'upvote' : 'downvote';
        if (serverType !== stored) {
          // حول الفرق بين المخزن والمحسوب من الخادم
          if (stored === 'upvote') {
            setUpcount(prev => prev + 1);
            setDowncount(prev => Math.max(0, prev - 1));
          } else {
            setDowncount(prev => prev + 1);
            setUpcount(prev => Math.max(0, prev - 1));
          }
        }
      }
    }
    // إذا لا يوجد stored ويوجد agreed => لا تعديل لأن الخادم يعكس حالتك بالفعل.

    initializedForPost.current = postId;
  }, [postId, isBrowser, agreed]);

  const handleShare = () => {
    setShowSharePanel(true);
  };

  const handleSocialShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/talk/${postId}`;
    let url = '';

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(' STUvoice \n منشور من')}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`\n STUvoice منشور من ${shareUrl}`)}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('\n STUvoice منشور من')}`;
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

const handleUpvote = () => {
  // console.log('--- بدء handleUpvote ---');
  // console.log('الحالة الحالية:', { agreed, localUpvote, localDownvote, upcount, downcount });

  // إذا كان هناك تفاعل إيجابي (سواء من الخادم أو المحلي)
  if (agreed === true || localUpvote) {
    // console.log('حالة إلغاء التفاعل الإيجابي');
    
    // إعادة تعيين الحالة المحلية أولاً
    setLocalUpvote(false);
    setUpcount(prev => Math.max(0, prev - 1));
    
    // إذا كان التفاعل من الخادم (agreed === true) نرسل طلب إلغاء
    if (agreed === true) {
      onAgree(); // إلغاء التفاعل في الخادم
    }
    
    // إذا كان التفاعل محلياً فقط (localUpvote) نمسحه من التخزين
    if (localUpvote) {
      writeStoredReaction(postId, null);
    }
    
    // console.log('الحالة بعد الإلغاء:', { localUpvote: false, upcount: upcount - 1 });
    return;
  }

  // console.log('حالة إضافة تفاعل إيجابي جديد');
  
  // إلغاء أي تفاعل سلبي موجود أولاً
  if (agreed === false || localDownvote) {
    // console.log('إزالة التفاعل السلبي الموجود');
    setLocalDownvote(false);
    setDowncount(prev => Math.max(0, prev - 1));
  }

  // إضافة التفاعل الجديد
  setLocalUpvote(true);
  setUpcount(prev => prev + 1);
  writeStoredReaction(postId, 'upvote');
  onAgree(); // إعلام الخادم بالتفاعل الجديد
  
  // console.log('الحالة النهائية:', { localUpvote: true, localDownvote: false, upcount: upcount + 1, downcount: localDownvote ? downcount - 1 : downcount });
};

const handleDownvote = () => {
  // console.log('--- بدء handleDownvote ---');
  // console.log('الحالة الحالية:', { agreed, localUpvote, localDownvote, upcount, downcount });

  // إذا كان هناك تفاعل سلبي (سواء من الخادم أو المحلي)
  if (agreed === false || localDownvote) {
    // console.log('حالة إلغاء التفاعل السلبي');
    
    // إعادة تعيين الحالة المحلية أولاً
    setLocalDownvote(false);
    setDowncount(prev => Math.max(0, prev - 1));
    
    // إذا كان التفاعل من الخادم (agreed === false) نرسل طلب إلغاء
    if (agreed === false) {
      onDisagree(); // إلغاء التفاعل في الخادم
    }
    
    // إذا كان التفاعل محلياً فقط (localDownvote) نمسحه من التخزين
    if (localDownvote) {
      writeStoredReaction(postId, null);
    }
    
    // console.log('الحالة بعد الإلغاء:', { localDownvote: false, downcount: downcount - 1 });
    return;
  }

  // console.log('حالة إضافة تفاعل سلبي جديد');
  
  // إلغاء أي تفاعل إيجابي موجود أولاً
  if (agreed === true || localUpvote) {
    // console.log('إزالة التفاعل الإيجابي الموجود');
    setLocalUpvote(false);
    setUpcount(prev => Math.max(0, prev - 1));
  }

  // إضافة التفاعل الجديد
  setLocalDownvote(true);
  setDowncount(prev => prev + 1);
  writeStoredReaction(postId, 'downvote');
  onDisagree(); // إعلام الخادم بالتفاعل الجديد
  
  // console.log('الحالة النهائية:', { localUpvote: false, localDownvote: true, upcount: localUpvote ? upcount - 1 : upcount, downcount: downcount + 1 });
};

  return (
    <>
      <div className="flex justify-between items-center px-3 py-4 md:px-4 md:py-6">
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="flex items-center text-gray-500 text-xs md:text-sm">
            {/* <FaEye className="ml-1 mr-1.5" size={12} />
            <span>{readersCount}</span> */}
          
          <button 
            onClick={handleShare}
            className="p-1 rounded-full text-blue-500 hover:bg-blue-100 transition-colors"
            title="مشاركة">
            <FaShare size={12} />
          </button>
          </div>
          <ReportComponent id={postId} username={userId} type="p" />
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          {/* <ReportComponent id={postId} username={userId} type="p" /> */}

            {showDiscussIcon&&<Link 
            href={`/talk/${postId}`} 
            className="flex items-center rounded-xl text-blue-500 hover:bg-blue-100 text-xs md:text-sm"
          >
            <FaComments className="ml-1 mr-1.5" size={14} />
            <span className="text-[12px] mr-1">المناقشة</span>
          </Link>}

          <div className="flex items-center">
            <button 
              onClick={handleUpvote}
              className={`p-1 rounded-full ${localUpvote ? 'bg-green-50 text-green-600' : 'text-gray-500'} hover:bg-green-50 transition-colors`}
              title="أعجبني"
            >
              <FaArrowUp size={12} />
            </button>
            <span className="mx-1 text-xs md:text-sm text-gray-600">{upcount}</span>
          </div>

          <div className="flex items-center">
            <button 
              onClick={handleDownvote}
              className={`p-1 rounded-full ${localDownvote ? 'bg-red-50 text-red-600' : 'text-gray-500'} hover:bg-red-50 transition-colors`}
              title="لم يعجبني"
            >
              <FaArrowDown size={12} />
            </button>
            <span className="mx-1 text-xs md:text-sm text-gray-600">{downcount}</span>
          </div>
        </div>
      </div>

      {showSharePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-scale-in">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">مشاركة المنشور</h3>
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