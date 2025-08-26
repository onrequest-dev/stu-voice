
// فتح قاعدة البيانات وإنشاء object store إذا لم يكن موجود

const DB_NAME = 'notifications-db';
const STORE_NAME = 'notifications';
const DB_VERSION = 1;


function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}


export async function getAllNotifications() {
  const db = await openDB();
  const tx = (db as any).transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}


export async function updateNotification(notification:any) {
  const db = await openDB();
  const tx = (db as any).transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  store.put(notification);

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function markAllAsRead() {
  const notifications = await getAllNotifications();

  for (const notification of (notifications as any)) {
    notification.read = true; // تعيين كمقروءة
    await updateNotification(notification);
  }

  return notifications;
}

