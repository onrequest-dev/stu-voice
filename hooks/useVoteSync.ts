import { storeVotesAndSync } from '@/client_helpers/voteSync';
import { useEffect } from 'react';

const useVoteSync = () => {
  useEffect(() => {
    const syncOnExit = () => storeVotesAndSync();

    window.addEventListener('beforeunload', syncOnExit);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') syncOnExit();
    });

    return () => {
      window.removeEventListener('beforeunload', syncOnExit);
      document.removeEventListener('visibilitychange', syncOnExit);
    };
  }, []);
};

export default useVoteSync;
