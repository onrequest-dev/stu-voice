import { useNotification } from '@/hooks/NotificationContext';
import React from 'react';
import { FaBell } from 'react-icons/fa';

const NotificationIcon: React.FC = () => {
  const { hasNewNotification } = useNotification();
  return (
    <div className="relative">
      <FaBell size={20} />
      {hasNewNotification && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </div>
  );
};

export default NotificationIcon;
