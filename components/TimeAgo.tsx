'use client';
import { useEffect, useState } from 'react';

interface TimeAgoProps {
  timestamp: string;
  className?: string;
}

const TimeAgo = ({ timestamp, className = '' }: TimeAgoProps) => {
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    const calculateDisplayTime = () => {
      try {
        const now = new Date();
        const past = new Date(timestamp);
        
        if (timestamp === 'الآن') {
          return { text: 'الآن', fullDate: 'الآن' };
        }
        
        // التحقق من أن التاريخ صالح
        if (isNaN(past.getTime())) {
          return { text: 'تاريخ غير صالح', fullDate: 'تاريخ غير صالح' };
        }

        const diffInMs = now.getTime() - past.getTime();
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        
        // لحظات
        if (diffInSeconds < 10) {
          return { 
            text: 'الآن', 
            fullDate: formatFullDateTime(past)
          };
        }
        
        // أقل من دقيقة
        if (diffInSeconds < 60) {
          return { 
            text: `منذ ${diffInSeconds} ثانية`, 
            fullDate: formatFullDateTime(past)
          };
        }
        
        // أقل من ساعة (دقائق)
        if (diffInMinutes < 60) {
          return { 
            text: `منذ ${diffInMinutes} دقيقة`, 
            fullDate: formatFullDateTime(past)
          };
        }
        
        // أقل من 24 ساعة (ساعات)
        if (diffInHours < 24) {
          return { 
            text: `منذ ${diffInHours} ساعة`, 
            fullDate: formatFullDateTime(past)
          };
        }
        
        // اليوم (أقل من 48 ساعة)
        if (diffInDays === 1) {
          return { 
            text: `أمس، ${formatTime(past)}`, 
            fullDate: formatFullDateTime(past)
          };
        }

        // البارحة (أقل من 72 ساعة)
        if (diffInDays === 2) {
          return { 
            text: `البارحة، ${formatTime(past)}`, 
            fullDate: formatFullDateTime(past)
          };
        }

        // أكثر من يومين - عرض التاريخ فقط
        return { 
          text: formatArabicDate(past), 
          fullDate: formatFullDateTime(past)
        };
      } catch (error) {
        return { text: '--', fullDate: '--' };
      }
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const formatArabicDate = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      return date.toLocaleDateString('ar-SA', options);
    };

    const formatFullDateTime = (date: Date) => {
      return date.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // حساب الوقت الأولي
    const result = calculateDisplayTime();
    setDisplayTime(result.text);

    // إعداد التحديث التلقائي فقط للتواريخ الحديثة
    let intervalId: NodeJS.Timeout | null = null;
    
    const past = new Date(timestamp);
    const diffInMs = Date.now() - past.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    // تحديث فقط إذا كان الوقت أقل من يومين
    if (diffInDays < 2) {
      intervalId = setInterval(() => {
        const newResult = calculateDisplayTime();
        setDisplayTime(newResult.text);
      }, 30000); // كل 30 ثانية
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
    >
      {displayTime}
    </span>
  );
};

export default TimeAgo;