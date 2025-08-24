// sw.js الموحد

// ✅ تفعيل Service Worker مباشرة بعد التثبيت
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// ✅ تفعيل وتهيئة
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated');
});

// ✅ استقبال الإشعارات (Push Notifications)
self.addEventListener('push', function (event) {
    console.log("pushn")
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge,
    image: data.image,
    actions: data.actions,
    vibrate: data.vibrate,
    tag: data.tag,
    data: data.data, // يمكن أن تحتوي على { url: "..." }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ✅ التعامل مع النقر على الإشعارات
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url;

  if (urlToOpen) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// ✅ مزامنة خلفية عند توفر الاتصال (Background Sync)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-votes') {
    event.waitUntil(syncVotes());
  }
});

// ✅ دالة مزامنة الأصوات المخزنة
async function syncVotes() {
  const votes = await getStoredVotes(); // من Cache

  if (!votes || votes.length === 0) return;

  try {
    await fetch('/api/opinions/sendreactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ votes }),
    });

    await clearStoredVotes(); // مسح البيانات بعد الإرسال
    console.log('[SW] Votes synced successfully');
  } catch (error) {
    console.error('[SW] Vote sync failed:', error);
  }
}

// ✅ جلب الأصوات المخزنة من الـ Cache
async function getStoredVotes() {
  const cache = await caches.open('vote-cache');
  const response = await cache.match('/unsynced-votes');
  return response ? response.json() : [];
}

// ✅ مسح الأصوات بعد إرسالها
async function clearStoredVotes() {
  const cache = await caches.open('vote-cache');
  await cache.delete('/unsynced-votes');
}
