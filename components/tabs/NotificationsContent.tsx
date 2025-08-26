import { useNotification } from "@/hooks/NotificationContext";
import { getAllNotifications, markAllAsRead } from "@/indexdb/notifcationdb";
import { useEffect } from "react";


const NotificationsContent = () => {
  const { markAsRead } = useNotification();
  useEffect(() => {
    async function fetchAndMarkRead() {
      const notifications = await getAllNotifications();
      markAllAsRead();
      console.log("الإشعارات:", notifications);
    }
    fetchAndMarkRead();
    markAsRead(); // المستخدم قرأ الإشعارات
  }, []);

  return <h1 className="text-3xl font-bold text-center my-8">الإشعارات</h1>;
};

export default NotificationsContent;
