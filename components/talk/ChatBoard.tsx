"use client"
// components/chat/ChatBoard.tsx
import React, {  useRef, useEffect, useState } from 'react';
import ChatBubble, { UserInfo } from './ChatBubble';
import CustomIcon from '../postcomponents/CustomIcon';
import { RiSendPlaneFill, RiArrowDropUpLine } from 'react-icons/ri';
import { getUserDataFromStorage } from '@/client_helpers/userStorage';
import { postComment } from '@/client_helpers/sendcomment';
import styles from '@/ScrollableArea.module.css';
import BackButton from '../BackButton';
type Message = {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
  user: UserInfo;
  replyTo?: {
    user: UserInfo;
    messageId: string;
    preview?: string;
  };
};

type Board = {
  id: string;
  title: string;
  description?: string;
  messages: Message[];
};

export interface ChatBoardProps {
  post_id: string|number;
  board: Board;
  me?: UserInfo;
  className?: string;
  onSend?: (payload: {
    boardId: string;
    message: Message;
  }) => void;
  onReport?: (payload: {
    boardId: string;
    messageId: string;
  }) => void;
  placeholder?: string;
  maxRows?: number;

  // جديد: محتوى المنشور ليتم عرضه كأول عنصر ضمن نفس قائمة الرسائل
  postContent?: React.ReactNode;
}

const ChatBoard: React.FC<ChatBoardProps> = ({
  board,
  className = '',
  onSend,
  onReport,
  placeholder = 'اكتب تعليقك…',
  maxRows = 6,
  post_id,
  postContent
}) => {
  const [input, setInput] = useState('');
  const [localBoard, setLocalBoard] = useState<Board>(board);
  const [replyingTo, setReplyingTo] = useState<{ user: UserInfo, messageId: string, preview: string } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [me, setMe] = useState<UserInfo | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const userData = getUserDataFromStorage();
    if (userData) {
      setMe(userData);
    } else {
      setMe({
        id: 'u_me_1',
        iconName: 'userCircle',
        iconColor: '#1d4ed8',
        bgColor: '#dbeafe',
        fullName: 'أنا',
      });
    }
  }, []);

  useEffect(() => {
    setLocalBoard(board);
  }, [board]);

  // تمرير إلى آخر الرسائل عند تحديث القائمة
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current;
    el.scrollTop = el.scrollHeight;
  }, [localBoard]);

  // التحقق من موضع التمرير لإظهار أو إخفاء زر الصعود للأعلى
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      // إظهار الزر عندما يكون التمرير لأسفل بما يكفي
      setShowScrollTop(scrollTop > clientHeight * 0.5);
    };

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
      return () => listElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleReply = (user: UserInfo, messageId: string, text: string) => {
    const preview = text.length > 30 ? text.substring(0, 30) + '...' : text;
    setReplyingTo({ user, messageId, preview });
    setTimeout(() => textRef.current?.focus(), 0);
  };

  const handleReport = (messageId: string) => {
    onReport?.({ boardId: localBoard.id, messageId });
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    let cleanText = trimmed;

    if (replyingTo && !cleanText.startsWith(`@${replyingTo.user.id}`)) {
      cleanText = ` @${replyingTo.user.id}\n${cleanText}`;
    }
    if (!me) return;

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      user: me,
      ...(replyingTo && {
        replyTo: {
          user: replyingTo.user,
          messageId: replyingTo.messageId,
          preview: replyingTo.preview
        }
      })
    };

    postComment({ id: post_id, content: newMsg.text });

    setLocalBoard((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    // onSend?.({ boardId: localBoard.id, message: newMsg });
    setInput('');
    setReplyingTo(null);
    setTimeout(() => textRef.current?.focus(), 0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSend();
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ضبط ارتفاع textarea تلقائيًا
  useEffect(() => {
    const ta = textRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const lineHeight = 24;
    const maxHeight = maxRows * lineHeight;
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + 'px';
  }, [input, maxRows]);

  // إضافة اسم المستخدم عند الرد
  useEffect(() => {
    if (replyingTo && !input.startsWith(`@${replyingTo.user.id}`)) {
      setInput(`@${replyingTo.user.id}\n`);
    }
  }, [replyingTo]);

  // وظيفة للصعود إلى أعلى المحادثة
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={['h-screen w-full flex flex-col bg-white', className].join(' ')}>
                          {/* زر العودة داخل الحاوية ولكن بموضع ثابت */}
      {!showScrollTop && (
        <div className="fixed top-1 left-2 z-50 transition-all duration-300 ease-in-out">
          <BackButton/>
        </div>
      )}
      <div className="flex-1 flex flex-col">
        {/* منطقة الرسائل مع تمرير عمودي فقط */}
        <div
          ref={listRef}
          className={`flex-1 overflow-y-auto ${styles.scrollContainer} p-2 scroll-smooth bg-white`}
          style={{ maxHeight: 'calc(100vh - 75px)' }}
        >

          {/* محتوى الرسائل داخل حاوية مركزة */}
          <div className="max-w-2xl mx-auto w-full space-y-4 mt-6">
            {/* المنشور كأول عنصر داخل نفس قائمة الرسائل */}
            {postContent && (
              <div className="w-full mb-6">
                {postContent}
              </div>
            )}

            {localBoard?.messages?.length ? (
              localBoard.messages.map((msg) => (
                <div key={msg.id} className="py-2">
                  <ChatBubble
                    isMine={msg.isMine}
                    user={msg.user}
                    text={msg.text}
                    time={msg.time}
                    showTail={true}
                    onReply={() => handleReply(msg.user, msg.id, msg.text)}
                    onReport={() => handleReport(msg.id)}
                    messgid={msg.id}
                  />
                </div>
              ))
            ) : (
              // إن لم توجد رسائل، نظهر الفراغ فقط. لا نعرض شاشة "لا توجد رسائل" لأن لدينا منشور بالأعلى
              !postContent ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <CustomIcon icon="chatBubble" iconColor="#64748b" bgColor="transparent" size={18} />
                    </div>
                    <p className="text-slate-600 font-medium">لا توجد رسائل بعد</p>
                    <p className="text-sm text-slate-500">ابدأ المحادثة بكتابة رسالة أدناه</p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* زر الصعود للأعلى - يظهر فقط عند التمرير لأسفل */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-24 left-4 z-10 w-8 h-8 rounded-full bg-blue-300 text-white flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors shadow-gray-400"
            aria-label="الصعود إلى الأعلى"
          >
            <RiArrowDropUpLine className="w-8 h-8" />
          </button>
        )}

        {/* مدخل كتابة رسالة جديدة - ثابت في الأسفل */}
        <div className="border-t border-slate-200/70 p-4 bg-white fixed bottom-0 left-0 right-0">
          <div className="max-w-2xl mx-auto w-full">
            {replyingTo && (
              <div className="mb-2 flex items-center justify-between bg-slate-100 rounded-lg px-3 py-2">
                <div className="text-sm text-slate-600">
                  الرد على <span className="font-medium text-emerald-600">@{replyingTo.user.fullName}</span>
                  <span className="text-slate-500 mx-2">|</span>
                  <span className="text-slate-500">{replyingTo.preview}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setReplyingTo(null); setInput(' '); }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex items-end gap-2 w-full">
              <textarea
                ref={textRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                dir="rtl"
                className={[
                  'flex-1 resize-none rounded-xl border',
                  'border-slate-200',
                  'bg-white/90',
                  'px-4 py-3',
                  'text-sm text-right',
                  'text-slate-800 placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/40'
                ].join(' ')}
                placeholder={placeholder}
                style={{ minHeight: '44px' }}
              />
              <button
                type="button"
                onClick={handleSend}
                className={[
                  'inline-flex items-center justify-center h-11 w-11 rounded-full',
                  'transition-colors duration-200',
                  input.trim()
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                ].join(' ')}
                aria-label="إرسال"
                title="إرسال"
                disabled={!input.trim()}
              >
                <RiSendPlaneFill className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBoard;