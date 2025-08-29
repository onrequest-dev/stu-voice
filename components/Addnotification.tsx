"use client";

import { notification_promot } from "@/static/keywords";
import React, { useEffect, useState } from "react";
import { MdNotificationsActive } from "react-icons/md";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
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

const Addnotification = ({
  message = notification_promot,
  afterDone,
}: {
  message?: string;
  afterDone: () => void;
}) => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    console.log("hi")
    // تحقق من حالة localStorage أولاً
    const notifStatus = localStorage.getItem("notification_status");
    if (notifStatus === "granted") {
      return; // تم التفعيل مسبقاً، تجاهل
    }
    registerPush();

    // نتحقق من حالة إذن الإشعارات
    // if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      setShowPrompt(true);
    } else if (Notification.permission === "granted") {
      // نحفظ الحالة ونوقف
      localStorage.setItem("notification_status", "granted");
      return;
    }
    // لا شيء إذا كان مرفوض
  }, []);

  async function registerPush() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.error("VAPID public key is missing!");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);

      // ✅ تحقق أولًا إن كان هناك اشتراك سابق
      let subscription = await registration.pushManager.getSubscription();

      // ❗️ إذا لم يوجد، نقوم بإنشاء اشتراك جديد
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });
      }

      // ✅ أرسل الاشتراك إلى السيرفر (حتى لو كان سابقًا لتأكيد وجوده في قاعدة البيانات)
      await fetch("/api/save-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      await fetch("/api/auth/confirm_account", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("notification_status", "granted");
      console.log("Push subscription saved successfully!");

    } catch (error) {
      localStorage.setItem("notification_status", "granted");
      console.error("Error during push registration:", error);
    }
  }
}


  const handleAccept = async () => {
    setShowPrompt(false);
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      localStorage.setItem("notification_status", "granted");

      // تسجيل الاشتراك
      await registerPush();
    } else {
      console.log("User denied permission");
    }
    afterDone();
  };

  const handleDecline = () => {
    setShowPrompt(false);
    afterDone();
  };

  return (
    <>
      {showPrompt && (
        <PermissionPrompt
          message={message}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </>
  );
};

export default Addnotification;
