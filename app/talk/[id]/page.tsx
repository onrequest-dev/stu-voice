import ChatBoard from '@/components/talk/ChatBoard';
import { UserInfo } from '@/components/talk/ChatBubble';
import { decodeJWT } from '@/lib/decodejwt';
import { supabase } from '@/lib/supabase';
import {  formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PostComponent from '@/components/postcomponents/Posts/PostComponent';
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

const getUsernameFromJWT = (): string => {
  const jwt = cookies().get('jwt')?.value;
  if (!jwt) redirect('/auth/login');

  const jwt_user = decodeJWT(jwt) as JwtPayload | null;
  if (!jwt_user || typeof jwt_user === 'string' || !jwt_user.user_name) {
    redirect('/auth/login');
  }

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
      iconName: comment.icon_component,
      iconColor: comment.icon_color,
      bgColor: comment.bg_color,
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
  const username = getUsernameFromJWT();
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
    console.error('حدث خطأ أثناء جلب المنشور:', postError);
    return <div>حدث خطأ أثناء جلب المنشور.</div>;
  }

  if (!postDataRaw || postDataRaw.length === 0) {
    return <div>لم يتم العثور على المنشور.</div>;
  }

  const post = postDataRaw[0];

  const postData = {
    id: post.id,
    userInfo: {
      id: post.publisher_username,
      iconName: post.icon?.name || 'graduation',
      iconColor: post.icon?.color || '#ffffff',
      bgColor: post.icon?.bgColor || '#3b82f6',
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
    poll: post.poll || null,
  };


  return <ChatBoard board={board}  post_id={params.id}   postContent={
    <PostComponent
      id={postData.id}
      userInfo={postData.userInfo}
      opinion={postData.opinion}
      poll={postData.poll}
      createdAt={post.createdAt}
      showDiscussIcon={false}
    />}/>;
};

export default ChatPage;
