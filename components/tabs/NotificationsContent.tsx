import { useNotification } from "@/hooks/NotificationContext";
import { getAllNotifications, markAllAsRead } from "@/indexdb/notifcationdb";
import { useEffect } from "react";
import { SleekNotifications, NotificationItem } from "../NotificationsPanel";
const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'مرحباً بك!',
    body: 'تم إنشاء حسابك بنجاح.',
    timestamp: Date.now() - 2 * 60 * 1000,
    read: false,
  },
  {
    id: '2',
    title: 'تحديث جديد',
    body: 'أطلقنا ميزات جديدة — اضغط للاطلاع.',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    url: '/updates',
    read: true,
  },
  {
    id: '3',
    title: 'تم إكمال العملية',
    body: 'تمت معالجة طلبك بنجاح.',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    read: true,
  },
];

export const NotificationsContent = () => {
  const { markAsRead } = useNotification();

  useEffect(() => {
    async function fetchAndMarkRead() {
      const notifications = await getAllNotifications();
      // وضعك الحالي يطلب تعليم الكل كمقروء عند الدخول
      await markAllAsRead();
      console.log("الإشعارات:", notifications);
    }
    fetchAndMarkRead();
    // المستخدم فتح صفحة الإشعارات
    markAsRead();
  }, [markAsRead]);

  // في بيئة حقيقية، بدلاً من mockNotifications،
  // ستمتلك حالة state تُجلب من قاعدة البيانات.
  const handleMarkSingle = (id: string) => {
    // اربطها بدالة السياق لديك لتعليم مفرد كمقروء
    // مثال: markSingle(id)
    console.log('mark single as read:', id);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <SleekNotifications
        notifications={mockNotifications}
        onMarkAsRead={handleMarkSingle}
        title="مركز الإشعارات"
      />
    </div>
  );
};

export default NotificationsContent;