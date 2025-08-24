self.addEventListener('push', function (event) {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge,
    image: data.image,
    actions: data.actions,
    vibrate: data.vibrate,
    tag: data.tag,
    data: data.data, // نمرر بيانات إضافية مثل الرابط
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// فتح الرابط عند الضغط على الإشعار
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url;

  if (urlToOpen) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        // حاول تفتح الرابط في تبويب مفتوح بالفعل أو افتح جديد
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
