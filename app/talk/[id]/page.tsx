import ChatBoard from '@/components/talk/ChatBoard';
import { UserInfo } from '@/components/talk/ChatBubble';
import { decodeJWT } from '@/lib/decodejwt';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
    time: format(new Date(comment.created_at), 'hh:mm a', { locale: ar }),
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
    id: 'b1',
    title: 'نقاش عام',
    description: 'مساحة لطرح الأفكار السريعة.',
    messages,
  };

  return <ChatBoard board={board}  post_id={params.id}/>;
};

export default ChatPage;
