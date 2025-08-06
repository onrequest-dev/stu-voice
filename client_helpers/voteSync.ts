import { getVotesFromLocalStorage, clearVotes } from './localVotes';

export const storeVotesAndSync = async () => {
  const votes = getVotesFromLocalStorage();
  if (votes.length === 0) return;

  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const cache = await caches.open('vote-cache');
      await cache.put('/unsynced-votes', new Response(JSON.stringify(votes), {
        headers: { 'Content-Type': 'application/json' },
      }));
        console.log("Votes stored in cache, registering for background sync");
      await (registration as any).sync.register('sync-votes');
      clearVotes();
      console.log("Registered for background sync");
    } catch (error) {
      console.warn("Service Worker Sync failed, using fallback");
      fallbackSendVotes(votes);
    }
  } else {
    fallbackSendVotes(votes);
  }
};

const fallbackSendVotes = (votes: any[]) => {
    console.warn("Using fallback method to send votes");
  try {
    navigator.sendBeacon(
      '/api/opinions/sendreactions',
      new Blob([JSON.stringify({ votes })], { type: 'application/json' })
    );
    clearVotes();
  } catch (err) {
    console.error('SendBeacon fallback failed:', err);
  }
};
