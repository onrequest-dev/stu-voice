'use client';
import { useState, useRef, useEffect } from 'react';
import { FaReply, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import CustomIcon from '../CustomIcon';
import { UserInfo, ReplyType } from '../types';
import { TextExpander } from '../../TextExpander';
import ReportComponent from '@/components/ReportComponent';

interface CommentRepliesProps {
  comment: {
    id: string;
    userId: string;
    text: string;
    repliesCount: number;
    likes: number;
    timestamp: string;
  };
  userInfo: UserInfo;
  repliesData?: ReplyType[];
  usersData: Record<string, UserInfo>;
  onAddReply: (replyText: string, parentCommentId: string, repliedToUserId?: string) => void;
  onClose: () => void;
  currentUser: UserInfo;
  loadingReplies: boolean;
}
const CommentReplies = ({ 
  comment, 
  userInfo, 
  repliesData = [], 
  usersData, 
  onAddReply, 
  onClose,
  currentUser,
  loadingReplies
}: CommentRepliesProps) => {
  const [replies, setReplies] = useState<ReplyType[]>(repliesData);
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<UserInfo | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const repliesContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  console.log(repliesData.length);
  useEffect(() => {
    setReplies(repliesData);
  }, [repliesData]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleResize = () => {
      if (window.visualViewport) {
        const windowHeight = window.innerHeight;
        const visualViewportHeight = window.visualViewport.height;
        const newKeyboardHeight = windowHeight - visualViewportHeight;
        setKeyboardHeight(newKeyboardHeight > 50 ? newKeyboardHeight : 0);
      }
    };

    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (repliesContainerRef.current) {
      if (keyboardHeight > 0) {
        repliesContainerRef.current.scrollTop = repliesContainerRef.current.scrollHeight;
      } else {
        setTimeout(() => {
          if (repliesContainerRef.current) {
            repliesContainerRef.current.scrollTop = repliesContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    }
  }, [replies, keyboardHeight]);

  const handleReply = () => {
    if (newReply.trim()) {
      const reply: ReplyType = {
        id: Date.now().toString(),
        userId: currentUser.id,
        text: replyingTo 
          ? `@${replyingTo.fullName} ${newReply}` 
          : newReply,
        timestamp: 'الآن',
        repliedToUserId: replyingTo?.id
      };
      
      onAddReply(reply.text, comment.id, replyingTo?.id);
      setReplies([...replies, reply]);
      setNewReply('');
      setReplyingTo(null);
      
      setTimeout(() => {
        replyInputRef.current?.focus();
      }, 100);
    }
  };

  const startReplyingTo = (user: UserInfo) => {
    setReplyingTo(user);
    setTimeout(() => replyInputRef.current?.focus(), 100);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const calculateContainerHeight = () => {
    if (keyboardHeight > 0) {
      return `calc(100vh - ${keyboardHeight}px - 60px)`;
    }
    return '85vh';
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      ref={containerRef}
    >
      <div 
        className="bg-white rounded-t-lg w-full max-w-2xl flex flex-col"
        style={{
          height: calculateContainerHeight(),
          maxHeight: '85vh',
          transition: 'height 0.2s ease'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <button onClick={onClose} className="text-gray-500">
            <FaTimes size={18} />
          </button>
          <h3 className="text-lg font-medium">الردود و النقاشات</h3>
          <div className="w-6"></div>
        </div>

        {/* التعليق الأصلي */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500">
              {comment.timestamp}
            </span>
            <div className="flex items-center gap-3 pb-2">
              <div className="text-right">
                <h4 className="font-medium text-gray-900">{userInfo.fullName}</h4>
                <div className="flex items-center justify-end mt-1 gap-1">
                  <span className="text-xs text-gray-500">@{userInfo.id}</span>
                  <FaInfoCircle className="text-gray-400" size={10} />
                </div>
              </div>
              <div>
                <CustomIcon
                  icon={userInfo.iconName}
                  iconColor={userInfo.iconColor}
                  bgColor={userInfo.bgColor}
                  size={14}
                />
              </div>
            </div>
          </div>

          <div className="mt-2" dir="rtl">
            <TextExpander 
              text={comment.text}
              charLimit={170}
              className="text-gray-800 text-right text-sm md:text-base"
              dir="rtl"
            />
          </div>
        </div>

        {/* قائمة الردود */}
        <div 
          ref={repliesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            paddingBottom: keyboardHeight > 0 ? '80px' : '0'
          }}
        >
          {loadingReplies ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center text-gray-500 py-4">لا توجد ردود بعد</div>
          ) : (
            replies.map(reply => {
              const user = usersData[reply.userId] || currentUser;
              return (
                <div key={reply.id} className="flex gap-2 m-2 mr-4" dir="rtl">
                  <div className="flex-shrink-0">
                    <CustomIcon
                      icon={user.iconName}
                      iconColor={user.iconColor}
                      bgColor={user.bgColor}
                      size={12}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 justify-between w-full">
                      <span className="font-medium text-sm">{user.fullName}</span>
                      <span className="text-gray-500 text-xs">{reply.timestamp}</span>
                    </div>
                    <TextExpander 
                      text={reply.text}
                      charLimit={170}
                      className="text-gray-800 text-right text-sm md:text-base"
                      dir="rtl"
                    />
                    <div className="flex gap-3 mt-1">
                      <button 
                        onClick={() => startReplyingTo(user)}
                        className="flex items-center text-blue-600 text-xs gap-1"
                      >
                        <FaReply size={10} />
                        <span>رد</span>
                      </button>
                      <ReportComponent id={comment.id} username={userInfo.id} type="c" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* حقل إضافة رد */}
        <div 
          className="p-2 border-t bg-white"
          style={{
            position: keyboardHeight > 0 ? 'fixed' : 'static',
            bottom: keyboardHeight > 0 ? '0' : 'auto',
            left: 0,
            right: 0,
            maxWidth: 'max-w-2xl',
            margin: '0',
            zIndex: 60,
            borderTop: '1px solid #e5e7eb',
            boxShadow: keyboardHeight > 0 ? '0 -2px 10px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          {replyingTo && (
            <div className="flex items-center justify-between bg-blue-50 p-2 rounded-t-lg mb-2">
              <span className="text-blue-600 text-sm">جارٍ الرد على @{replyingTo.fullName}</span>
              <button 
                onClick={cancelReply}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={14} />
              </button>
            </div>
          )}
          <div className="flex gap-2 items-start">
            <div className="flex-1 flex gap-2">
              <textarea
                ref={replyInputRef}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder={replyingTo ? `اكتب ردك على ${replyingTo.fullName}` : "اكتب ردك..."}
                className="flex-1 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right resize-none text-sm pl-2 pr-2"
                rows={1}
                style={{ 
                  minHeight: '40px', 
                  maxHeight: '100px', 
                  overflowY: 'auto',
                  lineHeight: '1.5'
                }}
                dir="rtl"
              />
              <button
                onClick={handleReply}
                disabled={!newReply.trim()}
                className={`p-2 rounded-full self-end ${newReply.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500'}`}
              >
                <IoMdSend size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentReplies;