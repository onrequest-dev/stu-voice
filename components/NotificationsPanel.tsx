'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FiBell, FiClock, FiExternalLink } from 'react-icons/fi';

// ============ Types ============
export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  url?: string;
  read?: boolean;
}

interface SleekNotificationsProps {
  notifications: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  emptyMessage?: string;
  title?: string;
  className?: string;
}

// ============ Helper ============
const useNowTicker = (intervalMs = 60_000) => {
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
};

const formatTimeElapsedAr = (current: number, timestamp: number): string => {
  const diffInSeconds = Math.floor((current - timestamp) / 1000);
  if (diffInSeconds < 60) return 'الآن';

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `منذ ${minutes} دقيقة`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `منذ ${days} يوم`;

  return new Date(timestamp).toLocaleDateString('ar-SA');
};

// ============ Item ============

const NotificationCard: React.FC<{
  notification: NotificationItem;
  onClick?: () => void;
}> = ({ notification, onClick }) => {
  const now = useNowTicker(60_000);
  const timeText = useMemo(
    () => formatTimeElapsedAr(now, notification.timestamp),
    [now, notification.timestamp]
  );

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    notification.url ? (
      <Link
        href={notification.url}
        onClick={onClick}
        className="block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl"
      >
        {children}
      </Link>
    ) : (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-right focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl"
      >
        {children}
      </button>
    );

  return (
    <Wrapper>
      <div
        className={`p-4 rounded-xl transition-colors shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 ${
          notification.read ? 'bg-white' : 'bg-blue-50'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-gray-800 text-right leading-snug">
            {notification.title}
          </h3>
          {notification.url && (
            <FiExternalLink
              className="text-blue-500 shrink-0 mt-1"
              aria-label="رابط خارجي"
            />
          )}
        </div>
        <p className="text-gray-600 text-right mt-1">{notification.body}</p>

        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <FiClock className="ml-1" />
            <span>{timeText}</span>
          </div>
          {!notification.read && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              جديد
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

// ============ Main Component ============

export const SleekNotifications: React.FC<SleekNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  emptyMessage = 'لا توجد إشعارات',
  title = 'الإشعارات',
  className = ''
}) => {
  const { unread, read } = useMemo(() => {
    const sorted = [...notifications].sort((a, b) => b.timestamp - a.timestamp);
    return {
      unread: sorted.filter(n => !n.read),
      read: sorted.filter(n => n.read)
    };
  }, [notifications]);

  const handleOpen = (n: NotificationItem) => {
    if (!n.read && onMarkAsRead) onMarkAsRead(n.id);
  };

  return (
    <section className={`w-full max-w-2xl mx-auto ${className}`} dir="rtl">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center text-gray-800">
          <FiBell className="ml-2 text-blue-600" />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      </header>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-6">
          {unread.length > 0 && (
            <section>
              <div className="mb-2 text-sm text-gray-600 font-medium">
                غير مقروء ({unread.length})
              </div>
              <div className="grid grid-cols-1 gap-3">
                {unread.map(n => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onClick={() => handleOpen(n)}
                  />
                ))}
              </div>
            </section>
          )}

          {read.length > 0 && (
            <section>
              <div className="mb-2 text-sm text-gray-600 font-medium">
                مقروء ({read.length})
              </div>
              <div className="grid grid-cols-1 gap-3">
                {read.map(n => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
};