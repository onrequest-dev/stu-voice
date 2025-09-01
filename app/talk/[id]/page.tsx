import ChatBoard from '@/components/talk/ChatBoard';
import { UserInfo } from '@/components/talk/ChatBubble';
import { decodeJWT } from '@/lib/decodejwt';
import { supabase } from '@/lib/supabase';
import {  formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PostComponent from '@/components/postcomponents/Posts/PostComponent';
import Link from 'next/link';
type PostPageProps = {
  params: { id: string };
};

type CommentRaw = {
  comment_id: number;
  content: string;
  created_at: string;
  commenter_username: string;
  full_name: string;
  icon_color: string;
  bg_color: string;
  icon_component: string;
};

type JwtPayload = {
  user_name: string;
  [key: string]: any;
};

const getUsernameFromJWT = (post_id:string|number): string => {
  const jwt = cookies().get('jwt')?.value;
  if (!jwt) redirect(`/log-in?redirect=/talk/${post_id}`);

  const jwt_user = decodeJWT(jwt) as JwtPayload | null;
  if (!jwt_user || typeof jwt_user === 'string' || !jwt_user.user_name) {
    redirect(`/log-in?redirect=/talk/${post_id}`);
  }
  const hasComplitedInfo = jwt_user.has_complited_info;
  const message = "يرجى استكمال المعلومات قبل الوصول الى الصفحة ";
  const src = `/talk/${post_id}`
  if(!hasComplitedInfo||hasComplitedInfo==false) redirect(`/complete-profile?message=${message}&src=${src}`)
  return jwt_user.user_name;
};

const transformCommentsToMessages = (
  comments: CommentRaw[],
  currentUsername: string
) => {
  return comments.map((comment) => ({
    id: `m_${comment.comment_id}`,
    text: comment.content,
    time: formatDistanceToNow(new Date(comment.created_at),{
      addSuffix: true,  // يعطي "منذ" أو "بعد"
      locale: ar 
    }),
    isMine: comment.commenter_username === currentUsername,
    user: {
      id: `${comment.commenter_username}`,
      iconName: comment.icon_component||'user',
      iconColor: comment.icon_color||'#2600ffff',
      bgColor: comment.bg_color||'#ffffffff',
      fullName: comment.full_name,
    } as UserInfo,
  }));
};

const fetch_chat = async (post_id: string): Promise<CommentRaw[]> => {
  const { data, error } = await supabase.rpc('fetch_comments_with_users', {
    input_post_id: post_id,
    input_comment_replied_to_id: null,
  });

  if (error) {
    return [];
  }

  if (!data) return [];

  return data as CommentRaw[];
};

const ChatPage = async ({ params }: PostPageProps) => {
  const username = getUsernameFromJWT(params.id);
  const comments = await fetch_chat(params.id);
  const messages = transformCommentsToMessages(comments, username);

  const board = {
    id: params.id,
    title: 'نقاش عام',
    description: 'مساحة لطرح الأفكار السريعة.',
    messages,
  };

  
  // ==== جلب بيانات المنشور ====
  const { data: postDataRaw, error: postError } = await supabase
    .rpc('get_posts_by_id_or_publisher', {
      target_id: params.id,
      target_username: null,
    });

  if (postError) {
      return  ( 
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">حدث خطأ</h3>
      <p className="text-gray-600 text-center">حدث خطأ أثناء جلب المنشور. يرجى المحاولة مرة أخرى لاحقا</p>
    </div>
    );
  }

  if (!postDataRaw || postDataRaw.length === 0) {
    return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
  {/* اسم التطبيق مع تدرج اللون */}
  <span className="text-[28px] font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
    STUvoice
  </span>
  
  {/* أيقونة معدلة مع تدرج اللون */}
  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full mb-6 shadow-lg">
    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
  
  {/* النص الرئيسي */}
  <h3 className="text-xl font-semibold text-gray-800 mb-3">لا يوجد منشور</h3>
  <p className="text-gray-600 text-center max-w-md mb-8">لم يتم العثور على المنشور المطلوب </p>
  
  {/* زر العودة للصفحة الرئيسية */}
  <Link 
    href="/taps/HomeContent" 
    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span className='ml-2'>انتقل للصفحة الرئيسية</span>

  </Link>
</div>
);
  }

  const post = postDataRaw[0];
 
  const postData = {
    id: post.id,
    userInfo: {
      id: post.publisher_username,
      iconName: post.icon?.component ,
      iconColor: post.icon?.color ,
      bgColor: post.icon?.bgColor ,
      fullName: post.publisher_full_name,
      study: post.faculty,
    },
    opinion: {
      text: post.post,
      agreeCount: post.upvotes,
      disagreeCount: post.downvotes,
      readersCount: 0,
      commentsCount: 0,
    },
    poll: {"options":post?.poll?.options||[],"question":post?.poll?.title||"", "durationInDays": post?.poll?.durationInDays || -1},
  };
  return<> 
  <ChatBoard board={board}  post_id={params.id}   postContent={
    <PostComponent
      id={postData.id}
      userInfo={postData.userInfo}
      opinion={postData.opinion}
      poll={postData.poll}
      createdAt={post.created_at}
      showDiscussIcon={false}
    />}/>;
    </>
};

export default ChatPage;
