"use client"
// components/chat/ChatBoard.tsx
import React, { useMemo, useRef, useEffect, useState } from 'react';
import ChatBubble, { UserInfo } from './ChatBubble';
import CustomIcon from '../postcomponents/CustomIcon';
import { RiSendPlaneFill } from 'react-icons/ri';
import { getUserDataFromStorage } from '@/client_helpers/userStorage';
import { postComment } from '@/client_helpers/sendcomment';

type Message = {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
  user: UserInfo;
  replyTo?: {      // إضافة خاصية جديدة للردود
    user: UserInfo;
    messageId: string;
    preview?: string; // نص مختصر من الرسالة الأصلية
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
  board: Board;                    // لوحة واحدة فقط بدلاً من مصفوفة لوحات
  me?: UserInfo;                    // بياناتي لرسائل الإرسال الجديدة
  className?: string;              // تخصيص الحاوية الخارجية
  onSend?: (payload: {             // استرجاع الرسالة عند الإرسال (يمكن ربطها بباك-إند)
    boardId: string;
    message: Message;
  }) => void;
  onReport?: (payload: {           // دالة جديدة للإبلاغ عن الرسالة
    boardId: string;
    messageId: string;
  }) => void;
  placeholder?: string;            // نص حقل الإدخال
  maxRows?: number;  
                // أقصى ارتفاع لحقل النص قبل التمرير
}

const ChatBoard: React.FC<ChatBoardProps> = ({
  board,  // تغيير من boards إلى board
  className = '',
  onSend,
  onReport,
  placeholder = 'اكتب تعليقك…',
  maxRows = 6,
  post_id
}) => {
  const [input, setInput] = useState('');
  const [localBoard, setLocalBoard] = useState<Board>(board);
  const [replyingTo, setReplyingTo] = useState<{ user: UserInfo, messageId: string, preview: string } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [me, setMe] = useState<UserInfo | null>(null);
  
    useEffect(() => {
      const userData = getUserDataFromStorage();
      if (userData) {
        setMe(userData);
      } else {
        // إذا لم تكن هناك بيانات، يمكنك استخدام بيانات افتراضية
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

  // تمرير إلى آخر الرسائل عند إضافة رسالة
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current;
    el.scrollTop = el.scrollHeight;
  }, [localBoard]);

  const handleReply = (user: UserInfo, messageId: string, text: string) => {
    // إنشاء معاينة مختصرة للنص (أول 30 حرفًا)
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

    // إذا كنا نرد على رسالة، ننسق النص بشكل مناسب
    if (replyingTo && !cleanText.startsWith(`@${replyingTo.user.id}`)) {
      cleanText = `@${replyingTo.user.id}\n${cleanText}`;
    }
    if(!me) return(<div>loading......</div>)

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      user: me,
      // إذا كنا نرد على رسالة، أضف معلومات الرد
      ...(replyingTo && {
        replyTo: {
          user: replyingTo.user,
          messageId: replyingTo.messageId,
          preview: replyingTo.preview
        }
      })
    };
    postComment({"id":post_id,"content":newMsg.text})
    setLocalBoard((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));
    
    // onSend?.({ boardId: localBoard.id, message: newMsg });
    setInput('');
    setReplyingTo(null);
    
    // إعادة تركيز على الحقل
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

  // ضبط ارتفاع textarea تلقائياً
  useEffect(() => {
    const ta = textRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const lineHeight = 24; // تقريباً
    const maxHeight = maxRows * lineHeight;
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + 'px';
  }, [input, maxRows]);

  // إضافة اسم المستخدم عند الرد
  useEffect(() => {
    if (replyingTo && !input.startsWith(`@${replyingTo.user.id}`)) {
      setInput(`@${replyingTo.user.id}\n`);
    }
  }, [replyingTo]);

  return (
    <div className={['h-screen w-full flex flex-col', className].join(' ')}>
      <div className="flex-1 flex flex-col">
        {/* منطقة الرسائل */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-white dark:bg-neutral-900" // زيادة التباعد من space-y-3 إلى space-y-6
        >
          {localBoard?.messages?.length ? (
            localBoard.messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                isMine={msg.isMine}
                user={msg.user}
                text={msg.text}
                time={msg.time}
                showTail={true}
                onReply={() => handleReply(msg.user, msg.id, msg.text)}
                onReport={() => handleReport(msg.id)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800">
                  <CustomIcon icon="chatBubble" iconColor="#64748b" bgColor="transparent" size={18} />
                </div>
                <p className="text-slate-600 dark:text-neutral-300 font-medium">لا توجد رسائل بعد</p>
                <p className="text-sm text-slate-500 dark:text-neutral-400">ابدأ المحادثة بكتابة رسالة أدناه</p>
              </div>
            </div>
          )}
        </div>

        {/* مدخل كتابة رسالة جديدة */}
        <div className="border-t border-slate-200/70 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
          {replyingTo && (
            <div className="mb-2 flex items-center justify-between bg-slate-100 dark:bg-neutral-800 rounded-lg px-3 py-2">
              <div className="text-sm text-slate-600 dark:text-neutral-300">
                الرد على <span className="font-medium text-emerald-600 dark:text-emerald-400">@{replyingTo.user.fullName}</span>
                <span className="text-slate-500 dark:text-neutral-400 mx-2">|</span>
                <span className="text-slate-500 dark:text-neutral-400">{replyingTo.preview}</span>
              </div>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2">
            {/* حقل النص */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center">
                <div className="flex items-center w-full max-w-lg gap-2 m-2">
                    <textarea
                    ref={textRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={1}
                    dir="rtl"
                    className={[
                        'flex-1 resize-none rounded-xl border',
                        'border-slate-200 dark:border-neutral-700',
                        'bg-white/90 dark:bg-neutral-900/80',
                        'px-4 py-3',
                        'text-sm text-right',
                        'text-slate-800 placeholder:text-slate-400',
                        'dark:text-neutral-100 dark:placeholder:text-neutral-500',
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
                        : 'bg-slate-200 text-slate-500 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed'
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
    </div>
  );
};

export default ChatBoard;