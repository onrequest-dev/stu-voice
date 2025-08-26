'use client';
import { FaInfoCircle, FaReply } from 'react-icons/fa';
import CustomIcon from '../CustomIcon';
import { UserInfo } from '../types';
import { useState } from 'react';
import CommentReplies from './CommentReplies';
import { TextExpander } from '../../TextExpander';
import ReportComponent from '@/components/ReportComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getcomments } from '@/client_helpers/getcomments';
import TimeAgo from '@/components/TimeAgo';
interface ReplyType {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  repliedToUserId?: string;
}

interface CommentProps {
  postid?: string | number;
  comment: {
    id: string;
    text: string;
    likes: number;
    timestamp: string;
    repliesCount?: number;
  };
  userInfo: UserInfo;
  currentUser: UserInfo;
  usersData: Record<string, UserInfo>;
  onAddReply: (replyText: string, parentCommentId: string, repliedToUserId?: string) => Promise<void>;
}

const Comment = ({ 
  comment, 
  userInfo, 
  currentUser,
  usersData,
  onAddReply,
  postid
}: CommentProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const queryClient = useQueryClient();

  // مفتاح الاستعلام الفريد للردود
  const repliesQueryKey = ['commentReplies', comment.id];

  // استعلام لجلب الردود مع التخزين المؤقت
  const { data: repliesData = [], isLoading: loadingReplies, isError } = useQuery<ReplyType[]>({
    queryKey: repliesQueryKey,
    queryFn: async (): Promise<ReplyType[]> => {
      const result = await getcomments({
        input_post_id: postid?.toString() || "",
        input_comment_replied_to_id: comment.id.toString()
      });
      
      if (result?.status === 200 && Array.isArray(result.comments)) {
        return result.comments.map((reply: any) => ({
          id: reply.comment_id?.toString() || Math.random().toString(),
          userId: reply.user_id?.toString() || 'unknown',
          text: reply.content || '',
          timestamp: reply.created_at ? new Date(reply.created_at).toLocaleString() : 'الآن',
          repliedToUserId: reply.comment_replied_to_id?.toString()
        }));
      }
      return [];
    },
    enabled: showReplies && (comment.repliesCount || 0) > 0,
    staleTime: 5 * 60 * 1000, // 5 دقائق قبل اعتبار البيانات قديمة
    gcTime: 5 * 60 * 1000, // 5 دقائق للتخزين المؤقت (استبدل cacheTime بـ gcTime)
    retry: 2,
  });

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleAddReply = async (replyText: string, parentCommentId: string, repliedToUserId?: string) => {
    try {
      await onAddReply(replyText, parentCommentId, repliedToUserId);
      queryClient.invalidateQueries({ queryKey: repliesQueryKey });
    } catch (error) {
      throw error;
    }
  };
  return (
    <div className="border-b pb-4 mb-4 relative">
      {/* الصف العلوي: التاريخ ومعلومات المستخدم */}
      <div className="flex justify-between items-start">
        <span className="text-xs text-gray-500">
          <TimeAgo timestamp={comment.timestamp} />
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

      {/* نص التعليق */}
      <div className="mt-2" dir="rtl">
        <TextExpander 
          text={comment.text}
          charLimit={170}
          className="text-gray-800 text-right text-sm md:text-base"
          dir="rtl"
        />
      </div>

      {/* أزرار التفاعل */}
      <div className="flex mt-3 text-gray-500 justify-end gap-3">
        <ReportComponent id={comment.id} username={userInfo.id} type="c" />

        <button
          onClick={toggleReplies}
          className="flex items-center text-gray-500 hover:text-blue-600"
          disabled={loadingReplies}
        >
          <FaReply size={12} />
          <span className="text-xs ml-2">
            {loadingReplies ? (
              <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              `${comment.repliesCount || 0} ردود`
            )}
          </span>
        </button>
      </div>
        
      {/* شريط الردود */}
      {showReplies && (
        <CommentReplies 
          comment={{
            id: comment.id,
            userId: userInfo.id,
            text: comment.text,
            repliesCount: comment.repliesCount || 0,
            likes: comment.likes,
            timestamp: comment.timestamp
          }}
          userInfo={userInfo}
          repliesData={repliesData}
          usersData={usersData}
          onAddReply={onAddReply}
          onClose={() => setShowReplies(false)}
          currentUser={currentUser}
          loadingReplies={loadingReplies}
        />
      )}
    </div>
  );
};

export default Comment;