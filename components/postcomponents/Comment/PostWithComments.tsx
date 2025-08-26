'use client';
import { useState, useEffect, useRef } from 'react';
import { FaArrowRight, FaExclamationTriangle, FaRegComment, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import PostComponent from '../Posts/PostComponent';
import Comment from './Comment';
import { UserInfo, PostProps } from '../types';
import Link from 'next/link';
import CommentRulesAlert from './CommentRulesAlert';
import { getUserDataFromStorage } from '../../../client_helpers/userStorage';
import { postComment } from '@/client_helpers/sendcomment';

interface CommentType {
  id: string;
  userId: string;
  text: string;
  likes: number;
  timestamp: string;
  userLiked?: boolean;
  replies?: ReplyType[];
  repliesCount?: number;
}

interface ReplyType {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  repliedToUserId?: string;
}

interface PostWithCommentsProps {
  postData: PostProps;
  initialCommentsData?: {
    comments: CommentType[];
    users: Record<string, UserInfo>;
  };
}

const PostWithComments = ({ postData, initialCommentsData }: PostWithCommentsProps) => {
  const [comments, setComments] = useState<CommentType[]>(initialCommentsData?.comments || []);
  const [users, setUsers] = useState<Record<string, UserInfo>>(initialCommentsData?.users || {});
  const [newComment, setNewComment] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isManualTrigger, setIsManualTrigger] = useState(false);
  const [alertClosedPermanently, setAlertClosedPermanently] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentsSectionRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLDivElement>(null);

  // معلومات المستخدم الحالي
const [currentUser, setCurrentUser] = useState<UserInfo>({
  id: 'currentUser',
  iconName: 'user',
  iconColor: '#ffffff',
  bgColor: '#3b82f6',
  fullName: 'أنت',
  study: ''
});
useEffect(() => {
  const loadCurrentUser = () => {
    const userData = getUserDataFromStorage();
    if (userData) {
      setCurrentUser(userData);
    }
  };
  loadCurrentUser();
}, []);

  useEffect(() => {
    const closedPermanently = localStorage.getItem('commentAlertClosed') === 'true';
    setAlertClosedPermanently(closedPermanently);
  }, []);

  const fetchComments = async () => {
    if (comments.length > 0) return;
    
    setLoadingComments(true);
    try {
      // //////////////////////////////////////////////////////////حج هادي هون بتجيب التعليقات الاساسية
      const mockData = {
        comments: [
          {
            id: "1",
            userId: "user456",
            text: "هذا المنشور رائع جداً!",
            likes: 5,
            timestamp: "منذ ساعتين",
            replies: [
              {
                id: "reply1",
                userId: "user789",
                text: "أوافق على رأيك تماماً!",
                timestamp: "منذ ساعة"
              }
            ],
            repliesCount: 1
          },
          {
            id: "2",
            userId: "user789",
            text: "أوافق على الرأي المطروح",
            likes: 2,
            timestamp: "منذ 3 ساعات",
            repliesCount: 0
          }
        ],
        users: {
          "user456": {
            id: "user456",
            iconName: "user",
            iconColor: "#ffffff",
            bgColor: "#10b981",
            fullName: "سارة علي",
            study: "طبية"
          },
          "user789": {
            id: "user789",
            iconName: "user",
            iconColor: "#ffffff",
            bgColor: "#f59e0b",
            fullName: "محمد خالد",
            study: "هندسة"
          }
        }
      };
      
      setComments(mockData.comments);
      setUsers(prev => ({...prev, ...mockData.users}));
    } catch (error) {
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newState = !commentsOpen;
    
    // if (newState && comments.length === 0) {
    //   await fetchComments();
    // }
    
    setCommentsOpen(newState);
    
    if (newState && commentsSectionRef.current) {
      setTimeout(() => {
        commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };


  const handleAddComment = async () => {
    
    if (newComment.trim()) {
      const comment: CommentType = {
        id: Date.now().toString(),
        userId: currentUser.id,
        text: newComment,
        likes: 0,
        timestamp: 'الآن',
        userLiked: false,
        repliesCount: 0
      };
      try{
    const result = await postComment(
      {
        content : newComment,
        id : postData.id,
      }
    )
    comment.id = (result as any).post.id
  }catch{console.log("error")}
      
      setComments([comment, ...comments]);
      setUsers(prev => ({...prev, [currentUser.id]: currentUser}));
      setNewComment('');
      
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
    
  };
  
  const handleAddReply = async (replyText: string, parentCommentId: string, repliedToUserId?: string) => {
    let reply: ReplyType = {
      id: Date.now().toString(),
      userId: currentUser.id,
      text: repliedToUserId 
        ? `@${users[repliedToUserId]?.fullName} ${replyText}`
        : replyText,
      timestamp: 'الآن',
      repliedToUserId
    };
    try{
      const result = await postComment({
        content : replyText,
        id : postData.id,
        comment_replied_to_id : parentCommentId
      })
      reply.id = (result as any).post.id;
      
    }catch{console.log("error")}
    
    setComments(comments.map(comment => 
      comment.id === parentCommentId
        ? {
            ...comment,
            replies: [...(comment.replies || []), reply],
            repliesCount: (comment.repliesCount || 0) + 1
          }
        : comment
    ));
    
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const wasLiked = comment.userLiked;
        return { 
          ...comment, 
          likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
          userLiked: !wasLiked
        };
      }
      return comment;
    }));
  };

  const handleAlertClose = (permanent = false) => {
    if (permanent) {
      localStorage.setItem('commentAlertClosed', 'true');
      setAlertClosedPermanently(true);
    }
    setShowAlert(false);
    setIsManualTrigger(false);
  };

  const handleShowAlert = () => {
    setShowAlert(true);
    setIsManualTrigger(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen relative">
      {/* Header ثابت دائما */}
      <div className="sticky top-0 z-50 p-2 mb-2 border-b bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <Link 
            href="/taps/HomeContent" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowRight className="mr-2 transform rotate-180" />
            <span className="hidden sm:inline">العودة للمنشورات</span>
          </Link>
          
          <button
            onClick={handleShowAlert}
            className="flex items-center text-red-600 hover:text-red-800 transition-colors"
          >
            <FaExclamationTriangle className="mr-2" />
            <span className="hidden sm:inline">شروط التعليق</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-b">
        <PostComponent 
          id={postData.id}
          userInfo={postData.userInfo}
          opinion={postData.opinion}
          poll={postData.poll}
        />
      </div>

      {/* زر عرض/إخفاء التعليقات */}
      <div className="p-4 border-b">
        <button 
          onClick={toggleComments}
          className="flex items-center justify-end w-full text-lg font-semibold text-gray-800 gap-2"
          dir="rtl"
        >
          <span className="flex items-center gap-2">
            <span>التعليقات ({comments.length})</span>
            <FaRegComment />
          </span>
          {commentsOpen ? <FaChevronUp className="mr-2" /> : <FaChevronDown className="mr-2" />}
        </button>
      </div>

      {/* قائمة التعليقات مع التمرير */}
      <div
        className={`transition-all duration-300 ease-in-out ${commentsOpen ? 'max-h-[calc(100vh-300px)]' : 'max-h-0'}`}
      >
        <div 
          className={`overflow-y-auto ${commentsOpen ? 'block' : 'hidden'}`}
          style={{ height: 'calc(100vh - 300px)' }}
        >
          <div className="p-4 space-y-4">
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              comments.map(comment => {
                const user = users[comment.userId];
                return (
                  <Comment
                    postid ={postData.id}
                    key={comment.id}
                    comment={{
                      ...comment,
                      repliesCount: comment.replies?.length || comment.repliesCount
                    }}
                    userInfo={user}
                    currentUser={currentUser}
                    usersData={users}
                    onAddReply={handleAddReply}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* حقل التعليق */}
      <div
        ref={commentInputRef}
        className={`fixed bottom-0 left-0 right-0 bg-white p-3 border-t shadow-lg transition-all duration-200 ease-in-out ${commentsOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
      >
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="اكتب تعليقك..."
            className="flex-1 border border-gray-300 rounded-2xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right resize-none"
            rows={1}
            onKeyDown={handleKeyDown}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              overflowY: 'auto'
            }}
            dir="rtl"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={`p-2 rounded-full transition-colors ${newComment.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500'}`}
          >
            <IoMdSend size={20} />
          </button>
        </div>
      </div>

      {showAlert && (
        <CommentRulesAlert 
          isManualTrigger={isManualTrigger} 
          onClose={handleAlertClose} 
        />
      )}
    </div>
  );
};

export default PostWithComments;