const VOTE_KEY = "reactions";

export const getVotesFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(VOTE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const clearVotes = () => {
  localStorage.removeItem(VOTE_KEY);
};
