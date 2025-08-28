"use client";

import { notification_promot } from "@/static/keywords";
import React, { useEffect, useState } from "react";
import { MdNotificationsActive } from "react-icons/md";

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

type PermissionPromptProps = {
  message?: string;
  onAccept: () => void;
  onDecline: () => void;
};

const PermissionPrompt: React.FC<PermissionPromptProps> = ({
  message = notification_promot,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-right font-sans">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
          <MdNotificationsActive className="text-blue-600 w-8 h-8" />
          <p className="text-gray-800 font-semibold text-lg">{message}</p>
        </div>
        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
          <button
            onClick={onDecline}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            رفض
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            سماح
          </button>
        </div>
      </div>
    </div>
  );
};

const Addnotification = ({message = notification_promot,afterDone}:{message?:string,afterDone:()=>void}) => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // نتحقق من حالة الإذن أولاً
    if (!("Notification" in window)) return; // الإشعارات غير مدعومة

    if (Notification.permission === "default") {
      setShowPrompt(true); // نعرض البرومبت
    } else if (Notification.permission === "granted") {
      registerPush();
    }
    // في حال كان مرفوض لا نفعل شيء
  }, []);

  async function registerPush() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
          console.error("VAPID public key is missing!");
          return;
        }

        const applicationServerKey = urlBase64ToUint8Array(vapidKey);

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        await fetch("/api/save-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });

        console.log("Push subscription saved successfully!");
      } catch (error) {
        console.error("Error during service worker registration or push subscription:", error);
      }
    }
  }

  const handleAccept = async () => {
    setShowPrompt(false);
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await registerPush();
    } else {
      console.error("Permission for notifications was denied");
    }
    afterDone();
  };

  const handleDecline = () => {
    setShowPrompt(false);
    console.log("User declined notification permission");
    afterDone();
  };

  return <>{showPrompt && <PermissionPrompt message={message} onAccept={handleAccept} onDecline={handleDecline} />}</>;
};

export default Addnotification;
