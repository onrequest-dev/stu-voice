import webpush from "web-push"
import { supabase } from "./supabase";


// تهيئة web-push
webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// تهيئة Supabase (يفضل استخدام service role key)


/**
 * ترسل إشعار Web Push لمستخدم معين أو لجميع المستخدمين.
 * @param userName اسم المستخدم المستهدف أو '*' لجميع المستخدمين
 * @param payload محتوى الإشعار (title, body, ... )
 */
export async function sendNotificationToUser(
  userName: string | string[],
  payload: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    image?: string;
    actions?: { action: string; title: string; icon?: string }[];
    data?: { url?: string; [key: string]: any };
    vibrate?: number[];
    tag?: string;
    [key: string]: any;
  }
) {
  console.log("sending to ", userName);
  let query = supabase.from('webpush_subscriptions').select('*');

  if (userName !== '*') {
    if (Array.isArray(userName)) {
      query = query.in('user_name', userName);
    } else {
      query = query.eq('user_name', userName);
    }
  }

  const { data: subscriptions, error } = await query;

  if (error) {
    console.error('Error fetching subscriptions:', error);
    return;
  }

  if (!subscriptions || subscriptions.length === 0) {
    console.log('No subscriptions found for user(s):', userName);
    return;
  }

  const notificationPayload = JSON.stringify(payload);

  const batchSize = 50;  // عدد الإشعارات التي سترسل في نفس الوقت

  for (let i = 0; i < subscriptions.length; i += batchSize) {
    const batch = subscriptions.slice(i, i + batchSize);

    // نرسل الإشعارات في batch متوازية مع تجاهل أخطاء كل إشعار
    await Promise.all(
      batch.map(sub =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          notificationPayload
        ).catch(err => {
          console.error('Failed to send notification:', err);
        })
      )
    );
  }

  console.log('All notifications sent.');
}

