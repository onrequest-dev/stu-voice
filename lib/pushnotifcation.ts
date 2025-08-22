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
  userName: string,
  payload: { title: string; body: string; [key: string]: any }
) {
  let query = supabase.from('webpush_subscriptions').select('*');

  if (userName !== '*') {
    query = query.eq('user_name', userName);
  }

  const { data: subscriptions, error } = await query;

  if (error) {
    console.error('Error fetching subscriptions:', error);
    return;
  }

  if (!subscriptions || subscriptions.length === 0) {
    console.log('No subscriptions found for user:', userName);
    return;
  }

  const notificationPayload = JSON.stringify(payload);

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys,
        },
        notificationPayload
      );
      console.log(`Notification sent to ${sub.user_name || 'unknown user'}`);
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  }
}
