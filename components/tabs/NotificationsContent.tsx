import { useNotification } from "@/hooks/NotificationContext";
import { getAllNotifications, markAllAsRead } from "@/indexdb/notifcationdb";
import { useEffect, useState } from "react";
import { SleekNotifications, NotificationItem } from "../NotificationsPanel";

export const NotificationsContent = () => {
  const { markAsRead } = useNotification();
  const [notifications , setNotifications ] = useState<NotificationItem[]>([])
  useEffect(() => {
    async function fetchAndMarkRead() {
      const n = await getAllNotifications();
      // وضعك الحالي يطلب تعليم الكل كمقروء عند الدخول
      setNotifications(n as NotificationItem[]);
      await markAllAsRead();
      
    }
    fetchAndMarkRead();
    // المستخدم فتح صفحة الإشعارات
    markAsRead();
  }, [markAsRead]);

  // في بيئة حقيقية، بدلاً من mockNotifications،
  // ستمتلك حالة state تُجلب من قاعدة البيانات.


  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 mb-12">
      <SleekNotifications
        notifications={notifications}
        title="مركز الإشعارات"
      />
    </div>
  );
};

export default NotificationsContent;