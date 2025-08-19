// app/posts/[id]/page.tsx
import PostWithComments from '@/components/postcomponents/Comment/PostWithComments';
import { supabase } from '@/lib/supabase';

type PostPageProps = {
  params: { id: string };
};

// نوع البيانات الراجعة من RPC fetch_comments_with_users
type CommentWithUser = {
  comment_id: number;
  content: string;
  created_at: string;
  post_id: number;
  comment_replied_to_id: number | null;
  replies_count: number;
  commenter_username: string;
  full_name: string;
  icon: { name?: string; color?: string; bgColor?: string } | null;
  icon_color: string | null;
  bg_color: string | null;
  study: string | null;
};

export default async function PostPage({ params }: PostPageProps) {
  const postId = parseInt(params.id, 10);

  // ==== جلب بيانات المنشور ====
  const { data: postDataRaw, error: postError } = await supabase
    .rpc('get_posts_by_id_or_publisher', {
      target_id: postId,
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

  // ==== جلب التعليقات الرئيسية (ليست ردود) مع معلومات المستخدم ====
  const {
    data: commentsRaw,
    error: commentsError,
  }: { data: CommentWithUser[] | null; error: any } = await supabase
    .rpc('fetch_comments_with_users', {
      input_post_id: postId,
      input_comment_replied_to_id: null,
    });

  if (commentsError) {
    console.error('فشل في جلب التعليقات:', commentsError);
  }

  // ==== تحويل التعليقات إلى الشكل المناسب للمكون ====
  const comments = (commentsRaw || []).map((row) => ({
    id: row.comment_id.toString(),
    userId: row.commenter_username,
    text: row.content,
    timestamp: row.created_at,
    likes: 0, // يمكن تحديثه لاحقًا عند دعم الإعجابات
    repliesCount: row.replies_count || 0,
  }));
 
  // ==== تحويل معلومات المستخدمين إلى خريطة ====
  const users: Record<string, any> = {};
  for (const row of commentsRaw || []) {
    console.log(row)
    const userId = row.commenter_username;
    if (!users[userId]) {
      users[userId] = {
        id: userId,
        fullName: row.full_name,
        iconName: row.icon?.name ,
        iconColor: row.icon_color || '#ffffff',
        bgColor: row.bg_color || '#3b82f6',
        study: row.study || '',
      };
    }
  }
  
  return (
    <div className="container mx-auto py-8">
      <PostWithComments
        postData={postData}
        initialCommentsData={{
          comments,
          users,
        }}
      />
    </div>
  );
}
