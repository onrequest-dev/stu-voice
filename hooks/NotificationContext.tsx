import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NotificationContextType {
  hasNewNotification: boolean;
  markAsRead: () => void;
  notifyNew: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [hasNewNotification, setHasNewNotification] = useState<boolean>(false);

  useEffect(() => {
    const unread = localStorage.getItem('hasNewNotification') === 'true';
    setHasNewNotification(unread);
  }, []);

  const markAsRead = () => {
    setHasNewNotification(false);
    localStorage.setItem('hasNewNotification', 'false');
  };

  const notifyNew = () => {
    setHasNewNotification(true);
    localStorage.setItem('hasNewNotification', 'true');
  };

  return (
    <NotificationContext.Provider value={{ hasNewNotification, markAsRead, notifyNew }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
