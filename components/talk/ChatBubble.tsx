// components/chat/ChatBubble.tsx
import React from 'react';
import CustomIcon from '../postcomponents/CustomIcon';
import { TextExpander } from '../TextExpander';
import {FaReply } from 'react-icons/fa';
import ReportComponent from '../ReportComponent';
import {extractUsername} from '@/client_helpers/extractUsername'
import { BsPatchCheckFill } from 'react-icons/bs';
import Link from 'next/link';

export interface UserInfo {
  id: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
  fullName: string;
}

export interface ChatBubbleProps {
  isMine: boolean;
  user: UserInfo;
  text: string;
  time?: string;
  className?: string;
  bubbleClassName?: string;
  textCharLimit?: number;
  showTail?: boolean;
  onReply?: () => void;
  onReport?: () => void;
  messgid: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  isMine,
  user,
  text,
  time,
  className = '',
  bubbleClassName = '',
  textCharLimit = 220,
  showTail = true,
  onReply,
  onReport,
  messgid
}) => {
  const result1 = extractUsername(text);
  
  const bubbleColors = isMine
    ? {
        bg: 'bg-blue-500 text-white',
        bgcap: 'bg-blue-600 text-white',
        border: 'border border-indigo-800/30',
        shadow: 'shadow-lg shadow-indigo-900/50',
        tailLeft: 'border-r-blue-600',
        usernameColor: 'text-emerald-50/90',
        textColor: 'text-white',
        replyColor: 'text-emerald-600 hover:bg-emerald-100',
        timeColor: 'text-white opacity-80'
      }
    : {
        bg: 'bg-blue-200 text-neutral-900',
        bgcap: 'bg-blue-100 text-neutral-900',
        border: 'border border-blue-800/20',
        shadow: 'shadow-lg shadow-blue-900/30',
        tailRight: 'border-l-blue-200',
        usernameColor: 'text-neutral-500',
        textColor: 'text-neutral-900',
        replyColor: 'text-blue-600 hover:bg-blue-100',
        timeColor: 'text-neutral-600'
      };

  const containerJustify = isMine ? 'justify-start' : 'justify-end';
  const rowOrder = isMine ? 'flex-row' : 'flex-row-reverse';
   const isVerified = user.id === 'stuvoice'||user.id==='ecl_co';
  return (
    <div className={['w-full flex', containerJustify, className].join(' ')}>
      <div className={['flex items-end gap-1.5 min-w-[180px] max-w-[92%] sm:max-w-[80%]', rowOrder].join(' ')}>
        {/* الأيقونة */}
        <div className="shrink-0 self-start">
          <Link href={`/showuserdata/${user.id}`} className="flex-shrink-0">
            <CustomIcon
              icon={user.iconName}
              iconColor={user.iconColor}
              bgColor={user.bgColor}
              size={16}
            />
          </Link>
        </div>

        <div className="relative group min-w-[140px]">
          <div
            className={[
              'rounded-xl px-1 py-0.5 shadow-sm',
              'leading-relaxed break-words min-w-[140px]',
              bubbleColors.bgcap,
              bubbleColors.border,
              bubbleClassName
            ].join(' ')}
          >
            {/* الرأس - اسم المستخدم فقط */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center truncate">
              {isVerified && (
                <BsPatchCheckFill className="text-green-500" size={14} />
              )}
              <span className="font-semibold text-xs truncate ml-0.5">
                {user.fullName}
              </span>
              <span
                className={['text-[12px] ml-2', bubbleColors.usernameColor].join(' ')}
              >
                @{user.id}
              </span>
            </div>
          </div>

            {/* النص */}
            <div className={[
                'py-1 px-2 rounded-lg mb-0.5',
                bubbleColors.bg,      
                bubbleClassName
              ].join(' ')}>
              {result1.username && (
                <span dir="ltr" className={`text-xs ${isMine?'text-amber-300': 'text-blue-500'} font-bold`}>
                  {result1.username}
                </span>
              )}
              <TextExpander
                text={result1.remainingText}
                charLimit={textCharLimit}
                className="text-[9]"
                buttonClassName={
                  isMine
                  ? 'text-white/90 text-[9] cursor-pointer hover:underline'
                  : 'text-blue-600 text-[9] cursor-pointer hover:underline'
                }
              />
            </div>

            {/* الوقت في أسفل يسار الرسالة */}
            {time && (
              <div className="flex justify-start">
                <span className={['text-[8px]', bubbleColors.timeColor].join(' ')}>
                  {time}
                </span>
              </div>
            )}
          </div>

          {/* الذيل */}
          {showTail && (
            isMine ? (
              <span
                aria-hidden="true"
                className={[
                  'absolute top-2 -left-1.5',
                  'w-0 h-0',
                  'border-t-[6px] border-b-[6px] border-r-[8px]',
                  'border-transparent',
                  bubbleColors.tailLeft
                ].join(' ')}
              />
            ) : (
              <span
                aria-hidden="true"
                className={[
                  'absolute top-2 -right-1.5',
                  'w-0 h-0',
                  'border-t-[6px] border-b-[6px] border-l-[8px]',
                  'border-transparent',
                  bubbleColors.tailRight
                ].join(' ')}
              />
            )
          )}

          {/* أزرار الرد والإبلاغ */}
          {(onReply || onReport) && (
            <div className={[
                'absolute -bottom-8 transition-opacity mb-2',
                'flex items-center gap-1',
                isMine ? 'right-0' : 'left-0'
              ].join(' ')}>
              {onReply && (
                <button
                  onClick={onReply}
                  className={[
                    'flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px]',
                    bubbleColors.replyColor
                  ].join(' ')}
                  title="الرد على الرسالة"
                >
                  <FaReply size={10} />
                  رد
                </button>
              )}
              
              {onReport && (
                <ReportComponent 
                  id={`${messgid} , النص:${text}`} 
                  username={user.id} 
                  type="c" 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;