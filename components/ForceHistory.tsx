'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RedirectBackToMain = () => {
  const router = useRouter();

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      // عندما يحاول المستخدم الرجوع
      event.preventDefault(); // محاولة منع السلوك الافتراضي (قد لا يكون كافي)
      router.replace('/main');
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [router]);

  return null;
};

export default RedirectBackToMain;
