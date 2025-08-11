import { storeVotesAndSync } from '@/client_helpers/voteSync';
import { useEffect } from 'react';

const useVoteSync = () => {
  useEffect(() => {
    // تسجيل الـ Service Worker عند تحميل الصفحة
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('Service Worker registered with scope:', reg.scope);
        })
        .catch(err => {
          console.error('Service Worker registration failed:', err);
        });
    }

    // دالة لمزامنة الأصوات
    const syncOnExit = () => storeVotesAndSync();

    // مستمع قبل خروج المستخدم من الصفحة
    window.addEventListener('beforeunload', syncOnExit);

    // مستمع لتغير حالة رؤية الصفحة (visibility)
    // نحفظ الدالة في متغير حتى نقدر نشيلها لاحقاً
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        syncOnExit();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // التنظيف عند إزالة الـ hook
    return () => {
      window.removeEventListener('beforeunload', syncOnExit);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

export default useVoteSync;
