// public/sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

// مزامنة خلفية عند الاتصال
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-votes') {
    event.waitUntil(syncVotes());
  }
});

async function syncVotes() {
  const votes = await getStoredVotes(); // من IndexedDB أو من Cache
  if (votes.length === 0) return;

  try {
    await fetch('/api/opinions/sendreactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ votes }),
    });
    await clearStoredVotes(); // مسح بعد الإرسال
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// 🛠️ placeholder functions (يمكنك تحسينها باستخدام IndexedDB)
async function getStoredVotes() {
  const result = await caches.open('vote-cache');
  const response = await result.match('/unsynced-votes');
  return response ? response.json() : [];
}

async function clearStoredVotes() {
  const cache = await caches.open('vote-cache');
  await cache.delete('/unsynced-votes');
}
