// components/chat/ChatBubble.tsx
import React from 'react';
import CustomIcon from '../postcomponents/CustomIcon';
import { TextExpander } from '../TextExpander';
import {FaReply } from 'react-icons/fa';
import ReportComponent from '../ReportComponent';
import {extractUsername} from '@/client_helpers/extractUsername'
import Link from 'next/link';
export interface UserInfo {
  id: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
  fullName: string;
}

export interface ChatBubbleProps {
  isMine: boolean;            // true إذا كانت رسالتك أنت
  user: UserInfo;             // معلومات المستخدم المرسل لهذه الفقاعة
  text: string;               // نص الرسالة
  time?: string;              // وقت الإرسال (اختياري)
  className?: string;         // تخصيص للحاوية الخارجية
  bubbleClassName?: string;   // تخصيص للفقاعة
  textCharLimit?: number;     // حد الأحرف قبل "المزيد"
  showTail?: boolean;         // إظهار الذيل
  onReply?: () => void;       // دالة الرد على الرسالة (جديدة)
  onReport?: () => void;      // دالة جديدة للإبلاغ عن الرسالة
  messgid: string;
}

/**
 * السلوك:
 * - isMine=true: الفقاعة تنحاز لليسار، الأيقونة يسار الفقاعة، الذيل يسار، الوقت أسفل النص بمحاذاة نهاية الفقاعة.
 * - isMine=false: الفقاعة تنحاز لليمين، الأيقونة يمين الفقاعة، الذيل يمين، في العنوان يظهر الاسم على يمين الفقاعة والوقت على يسار السطر نفسه (justify-between).
 * - study تُعرض كنص ثانٍ صغير أسفل الاسم.
 */
const ChatBubble: React.FC<ChatBubbleProps> = ({
  isMine,
  user,
  text,
  time,
  className = '',
  bubbleClassName = '',
  textCharLimit = 120,
  showTail = true,
  onReply,
  onReport,
  messgid
}) => {
    const result1 = extractUsername(text);
const bubbleColors = isMine
  ? {
      bg: 'bg-blue-500 text-white',
      bgcap:'bg-blue-600 text-white',
      border: 'border border-indigo-800/30', // حدود شفافة
      shadow: 'shadow-lg shadow-indigo-900/50', // ظل خارجي غامق
      tailLeft: 'border-r-blue-600',
      usernameColor: 'text-emerald-50/90',
      textColor: 'text-white',
      replyColor: 'text-emerald-600 hover:bg-emerald-100',
      timeColor: 'text-white opacity-80'
    }
  : {
      bg: 'bg-blue-200 text-neutral-900',
      bgcap:'bg-blue-100 text-neutral-900',
      border: 'border border-blue-800/20',
      shadow: 'shadow-lg shadow-blue-900/30',
      tailRight: 'border-l-blue-200',
      usernameColor: 'text-neutral-500',
      textColor: 'text-neutral-900',
      replyColor: 'text-blue-600 hover:bg-blue-100',
      timeColor: 'text-neutral-600'
    };

  // ترتيب العناصر: رسائلي [Icon][Bubble] بمحاذاة يسار، الآخرين [Bubble][Icon] بمحاذاة يمين
  const containerJustify = isMine ? 'justify-start' : 'justify-end';
  const rowOrder = isMine ? 'flex-row' : 'flex-row-reverse';

  return (
    <div className={['w-full flex', containerJustify, className].join(' ')}>
      {/* التعديل: إضافة min-width للحاوية الداخلية */}
      <div className={['flex items-end gap-2 min-w-[200px] max-w-[92%] sm:max-w-[80%]', rowOrder].join(' ')}>
        {/* الأيقونة بجانب الفقاعة حسب جهة المرسل */}
        <div className="shrink-0 self-start">
            <Link 
                href={`/showdatauser/${user.id}`} 
                className="flex-shrink-0"
                >
          <CustomIcon
            icon={user.iconName}
            iconColor={user.iconColor}
            bgColor={user.bgColor}
            size={12}
          />
          </Link>
        </div>

        <div className="relative group min-w-[150px]">
          <div
            className={[
              'rounded-2xl px-2 py-0.5 shadow-sm',
              'leading-relaxed break-words min-w-[150px]',
              'transition-colors duration-200',
              bubbleColors.bgcap,
              bubbleColors.border,
              bubbleClassName
            ].join(' ')}
          >
            {/* الرأس */}
            <div
              className={[
                'flex items-start gap-2',
                isMine ? 'justify-start' : 'justify-between'
              ].join(' ')}
            >
              {/* عند كون الرسالة ليست لي: اضمن أن الاسم يظهر على يمين الفقاعة بالنسبة لي
                 باستخدام order لمنح الاسم أسبقية على الطرف الأيمن ضمن flex */}
              <div className={['flex flex-col', !isMine ? 'order-2' : 'order-1'].join(' ')}>
                <span className="font-semibold text-[10px] sm:text-sm leading-5">
                  {user.fullName}
                </span>
                <span
                    className={[
                      'text-[11px] sm:text-xs',
                      bubbleColors.usernameColor
                    ].join(' ')}
                  >
                    @{user.id}
                  </span>
              </div>

              {/* الوقت في رسائل الآخرين: على الطرف المقابل من الاسم في نفس السطر */}
              {!isMine && time && (
                <span
                  className={[
                    'text-[10px] sm:text-[11px] whitespace-nowrap ',
                    'text-neutral-600',
                    'order-1'
                  ].join(' ')}
                >
                  {time}
                </span>
              )}
            </div>

            {/* النص */}
              <div className={[`${!isMine?'mb-2':'mp-0'} py-4`,
                  'rounded-xl px-4',
                  'leading-relaxed break-words',
                  'transition-colors duration-200',
                  bubbleColors.bg,      
                  bubbleClassName
                ].join(' ')}>
                <span dir="ltr" className={`text-sm sm:text-[12px] ${isMine?'text-amber-300': 'text-blue-500'} mt-0 font-bold`} >{result1.username}</span>
                <TextExpander
                text={result1.remainingText}
                charLimit={textCharLimit}
                className="text-sm sm:text-[13px]"
                buttonClassName={
                    isMine
                    ? 'text-white/90 underline-offset-2 lg:text-sm text-xs cursor-pointer hover:underline focus:outline-none'
                    : 'text-blue-600 dark:text-blue-400 underline-offset-2 lg:text-sm text-xs cursor-pointer hover:underline focus:outline-none'
                }
                />
            </div>
            {/* الوقت لرسائلي: أسفل النص بمحاذاة نهاية الفقاعة */}
            {isMine && time && (
              <div className="flex justify-end">
                <span className={["text-[10px] sm:text-[11px]", bubbleColors.timeColor].join(' ')}>
                  {time}
                </span>
              </div>
            )}
          </div>

          {/* الذيل: يسار لرسائلي، يمين لرسائل الآخرين */}
          {showTail && (
            isMine ? (
              <span
                aria-hidden="true"
                className={[
                  'absolute top-4 -left-2',
                  'w-0 h-0',
                  'border-t-[8px] border-b-[8px] border-r-[10px]',
                  'border-transparent',
                  bubbleColors.tailLeft
                ].join(' ')}
              />
            ) : (
              <span
                aria-hidden="true"
                className={[
                  'absolute top-4 -right-2',
                  'w-0 h-0',
                  'border-t-[8px] border-b-[8px] border-l-[10px]',
                  'border-transparent',
                  bubbleColors.tailRight
                ].join(' ')}
              />
            )
          )}

          {/* أزرار الرد والإبلاغ - تظهر عند التمرير فوق الرسالة */}
          {(onReply || onReport) && (
            <div className={[
                'absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity',
                'flex items-center gap-1',
                isMine ? 'right-0' : 'left-0'
                ].join(' ')} style={{ transitionDuration: '2000ms' }}>
              {onReply && (
                <button
                  onClick={onReply}
                  className={[
                    'flex items-center gap-1 px-2 py-1 rounded-md text-xs',
                    bubbleColors.replyColor
                  ].join(' ')}
                  title="الرد على الرسالة"
                >
                  <FaReply size={12} />
                  رد
                </button>
              )}
              
              {onReport && (
                  <ReportComponent id={`${messgid} , النص:${text}`} username={user.id} type="c" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;