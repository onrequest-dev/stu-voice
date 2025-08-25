"use client";

import React, { useEffect } from "react";

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
const Addnotification = () => {
  useEffect(() => {
    async function registerPush() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          const permission = await Notification.requestPermission();

          if (permission !== "granted") {
            console.error("Permission for notifications was denied");
            return;
          }

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

    registerPush();
  }, []);

  return <></>;
};

export default Addnotification;
