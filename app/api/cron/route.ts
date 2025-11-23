import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { sendNotificationToUser } from '@/lib/pushnotifcation';
 
export async function GET(request: NextRequest) {
//   const authHeader = request.headers.get('authorization');
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//     return new Response('Unauthorized', {
//       status: 401,
//     });
//   }
    const post = await postOpinion();
    if(post){
    sendNotificationToUser("*",
      {
        "title":"لقد وصل الرأي اليومي 😊😊",
        "body":`${post?.slice(0,20)}...`,
        "data":{"url":"/DailyOpinion"}
      }
    )
  }
 
  return Response.json({ success: true });
}









const postOpinion = async () => {
  // 1. جلب أحدث منشور مجدول
  const { data: scheduledPosts, error: fetchError } = await supabase
    .from('scheduled_posts')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1);
  
  if (fetchError || !scheduledPosts || scheduledPosts.length === 0) {
    return;
  }

  const scheduledPost = scheduledPosts[0];

  // 2. حذف المنشور من جدول scheduled_posts
  const { error: deleteError } = await supabase
    .from('scheduled_posts')
    .delete()
    .eq('id', scheduledPost.id);

  if (deleteError) {
    return;
  }




  delete scheduledPost.created_at;
  delete scheduledPost.poll_expire_date;
  delete scheduledPost.post_id; 
  delete scheduledPost.id;


  const {data, error: upsertError } = await supabase
    .from('posts')
    .insert([scheduledPost])
    .select("id")
    .single(); // سيقوم بتحديث السطر إذا كان موجودً
  if (upsertError) {
    return;
  }
  // اضافة ال  id  الى جدول معرفات المنشورات اليومية 
  const {error:daily_opinoin_idsError} = await supabase
  .from("daily_opinoin_ids").insert({"daily_opinoin_id":data.id})
  if(daily_opinoin_idsError) return;

  // 4. إدخال خيارات التصويت (إن وجدت)
  
  const poll = scheduledPost.poll;

  if (poll && Array.isArray(poll.options)) {
    // حذف خيارات التصويت القديمة المرتبطة بـ id = 101 (إن وجدت)
    const optionsToInsert = poll.options.map((option: string) => ({
      vote_id: data.id,
      title: option,
    }));

    const { error: pollError } = await supabase
      .from('polls_options')
      .insert(optionsToInsert);

    if (pollError) {
    } else {
    }
  }


  revalidatePath('/daily-opinion'); 
  return  (scheduledPost as any).post as string
};
