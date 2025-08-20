'use client';
import React, { useEffect, useState } from 'react';
import ChatBoard from '@/components/talk/ChatBoard';
import { UserInfo } from '@/components/talk/ChatBubble';
import { getUserDataFromStorage } from '@/client_helpers/userStorage'; // تأكد من مسار الاستيراد الصحيح

const ChatPage = () => {
  const [me, setMe] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userData = getUserDataFromStorage();
    if (userData) {
      setMe(userData);
    } else {
      // إذا لم تكن هناك بيانات، يمكنك استخدام بيانات افتراضية
      setMe({
        id: 'u_me_1',
        iconName: 'userCircle',
        iconColor: '#1d4ed8',
        bgColor: '#dbeafe',
        fullName: 'أنا',
      });
    }
  }, []);

  const other: UserInfo = {
    id: 'u_other_1',
    iconName: 'user',
    iconColor: '#0f766e',
    bgColor: '#ccfbf1',
    fullName: 'أحمد علي',
  };

  // لوحة واحدة بدلاً من مصفوفة لوحات
  const board = {
    id: 'b1',
    title: 'نقاش عام',
    description: 'مساحة لطرح الأفكار السريعة.',
    messages: [
      { id: 'm1', text: 'أهلاً بالجميع!', time: '10:00 ص', isMine: false, user: other },
      { id: 'm2', text: 'مرحباً أحمد 👋', time: '10:02 ص', isMine: true, user: me ? me : other }, // استخدام بيانات افتراضية إذا كان me null
      { id: 'm3', text: 'لدينا تحديثات على الواجهة خلال هذا الأسبوع. @شخاخ', time: '10:10 ص', isMine: false, user: other },
    ],
  };

  if (!me) {
    return <div>Loading...</div>; // عرض حالة التحميل حتى يتم جلب البيانات
  }

  return (
    <ChatBoard
      board={board}  // تغيير من boards إلى board
      me={me} // تأكد هنا أن me ليست null
      onSend={({ boardId, message }) => {
        // يمكنك هنا الإرسال لخادمك
        console.log('Sent to board:', boardId, message);
      }}
    />
  );
};

export default ChatPage;