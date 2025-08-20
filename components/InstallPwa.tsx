import React, { useEffect, useState } from 'react';

export default function InstallPWA(): JSX.Element | null {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);
  const [showGenericTip, setShowGenericTip] = useState(false);

  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  }

  useEffect(() => {
    const isIos = (): boolean => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    const isInStandaloneMode = (): boolean =>
      window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

    let beforeInstallPromptFired = false;

    const handler = (e: Event) => {
      e.preventDefault();
      beforeInstallPromptFired = true;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBtn(true);
      setShowGenericTip(false);
      setShowIosTip(false);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // تحقق بعد فترة قصيرة هل جاء الحدث أم لا
    const timeoutId = setTimeout(() => {
      if (!beforeInstallPromptFired) {
        if (isIos() && !isInStandaloneMode()) {
          setShowIosTip(true);
        } else {
          setShowGenericTip(true);
        }
      }
    }, 3000); // 3 ثواني مثلاً

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowInstallBtn(false);
      setShowIosTip(false);
      setShowGenericTip(false);
      setDeferredPrompt(null);
    } else {
      console.log('User dismissed the install prompt');
      setShowInstallBtn(false);
      if (/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())) {
        setShowIosTip(true);
      } else {
        setShowGenericTip(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showInstallBtn && !showIosTip && !showGenericTip) return null;

  return (
    <>
      {showInstallBtn && (
        <button
          onClick={handleInstallClick}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '10px 20px',
            zIndex: 1000,
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          تثبيت التطبيق
        </button>
      )}

      {showIosTip && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            padding: '15px',
            textAlign: 'center',
            borderTop: '1px solid #ccc',
            fontSize: '14px',
            zIndex: 1000,
          }}
        >
          لتثبيت التطبيق على جهاز iOS، اضغط على زر المشاركة في الأسفل ثم اختر إضافة إلى الشاشة الرئيسية
        </div>
      )}

      {showGenericTip && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            padding: '15px',
            textAlign: 'center',
            borderTop: '1px solid #ccc',
            fontSize: '14px',
            zIndex: 1000,
          }}
        >
          يمكنك تثبيت التطبيق عبر متصفحك من خلال خيار إضافة إلى الشاشة الرئيسي  أوInstall app
        </div>
      )}
    </>
  );
}
