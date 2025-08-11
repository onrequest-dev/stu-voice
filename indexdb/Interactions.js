// utils/db.js
class InteractionDB {
  constructor() {
    this.dbName = 'UserInteractionsDB';
    this.storeName = 'postInteractions';
    this.db = null;
    this.initializeDB();
  }

  async initializeDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        console.error('Failed to open IndexedDB', event);
        reject('Failed to open IndexedDB');
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'postId' });
        }
      };
    });
  }

  async getInteraction(postId) {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(postId);

      request.onsuccess = (event) => {
        resolve(event.target.result || null);
      };

      request.onerror = (event) => {
        console.error('Error getting interaction', event);
        reject(null);
      };
    });
  }

  async setInteraction(postId, interaction) {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ postId, ...interaction });

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        console.error('Error setting interaction', event);
        reject(false);
      };
    });
  }

  async deleteInteraction(postId) {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(postId);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        console.error('Error deleting interaction', event);
        reject(false);
      };
    });
  }
}

const interactionDB = new InteractionDB();
export default interactionDB;