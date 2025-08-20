'use client';
import { useEffect, useState } from 'react';

interface TimeAgoProps {
  timestamp: string;
  className?: string;
}

const TimeAgo = ({ timestamp, className = '' }: TimeAgoProps) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      try {
        const now = new Date();
        const past = new Date(timestamp);
        
        if (timestamp === 'الآن') {
            return 'الآن';
        }
        // التحقق من أن التاريخ صالح
        if (isNaN(past.getTime())) {
          return 'تاريخ غير صالح';
        }

        const diffInMs = now.getTime() - past.getTime();
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        
        // لحظات
        if (diffInSeconds < 10) {
          return 'الآن';
        }
        
        // أقل من دقيقة
        if (diffInSeconds < 60) {
          return `منذ ${diffInSeconds} ثانية`;
        }
        
        // أقل من ساعة (دقائق)
        if (diffInMinutes < 60) {
          return `منذ ${diffInMinutes} دقيقة`;
        }
        
        // أقل من 24 ساعة (ساعات)
        if (diffInHours < 24) {
          return `منذ ${diffInHours} ساعة`;
        }
        
        // أقل من 48 ساعة
        if (diffInDays === 1) {
          return 'اليوم';
        }
        
        // أقل من 72 ساعة
        if (diffInDays === 2) {
          return 'الأمس';
        }

        // أكثر من 72 ساعة - عرض التاريخ
        return formatArabicDate(past);
      } catch (error) {
        console.error('Error calculating time ago:', error);
        return '--';
      }
    };

    const formatArabicDate = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      return date.toLocaleDateString('ar-SA', options);
    };

    // حساب الوقت الأولي
    setTimeAgo(calculateTimeAgo());

    // إعداد التحديث التلقائي فقط للتواريخ الحديثة
    let intervalId: NodeJS.Timeout | null = null;
    
    const past = new Date(timestamp);
    const diffInMs = Date.now() - past.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    // تحديث فقط إذا كان الوقت أقل من 24 ساعة
    if (diffInHours < 24) {
      intervalId = setInterval(() => {
        setTimeAgo(calculateTimeAgo());
      }, 30000); // كل 30 ثانية بدلاً من دقيقة لتقليل الضغط
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timestamp]);

  return (
    <span 
      className={`text-xs text-gray-500 inline-block ${className}`}
      dir="rtl"
      title={new Date(timestamp).toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    >
      {timeAgo}
    </span>
  );
};

export default TimeAgo;