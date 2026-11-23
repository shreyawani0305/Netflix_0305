import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'streambox-user';

// Seed initial state on first visit
const DEFAULT_USER_DATA = {
  myList: [],
  liked: [],
  progress: {
    'bird-box': 35,
    'the-haunting-of-hill-house': 62,
  },
  trailers: [],
};

const UserDataContext = createContext(null);

export function UserDataProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load user data from storage:', e);
    }
    // First visit: seed default data
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER_DATA));
    } catch (e) {}
    return DEFAULT_USER_DATA;
  });

  // Keep localStorage synchronized whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.warn('Failed to save user data:', e);
    }
  }, [userData]);

  // Toggle My List (newest first)
  const toggleMyList = (id) => {
    if (!id) return;
    setUserData((prev) => {
      const exists = prev.myList.includes(id);
      const nextList = exists
        ? prev.myList.filter((item) => item !== id)
        : [id, ...prev.myList.filter((item) => item !== id)];
      return { ...prev, myList: nextList };
    });
  };

  // Toggle Like (newest first)
  const toggleLike = (id) => {
    if (!id) return;
    setUserData((prev) => {
      const exists = prev.liked.includes(id);
      const nextLiked = exists
        ? prev.liked.filter((item) => item !== id)
        : [id, ...prev.liked.filter((item) => item !== id)];
      return { ...prev, liked: nextLiked };
    });
  };

  // Set Progress (0 - 100)
  const setProgress = (id, percent) => {
    if (!id) return;
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    setUserData((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        [id]: clamped,
      },
    }));
  };

  // Mark trailer watched (newest first)
  const markTrailerWatched = (id) => {
    if (!id) return;
    setUserData((prev) => {
      const nextTrailers = [id, ...prev.trailers.filter((t) => t !== id)];
      return { ...prev, trailers: nextTrailers };
    });
  };

  // Reset demo state
  const resetAll = () => {
    setUserData(DEFAULT_USER_DATA);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER_DATA));
    } catch (e) {}
  };

  const isInMyList = (id) => Boolean(id && userData.myList.includes(id));
  const isLiked = (id) => Boolean(id && userData.liked.includes(id));
  const getProgress = (id) => (id ? userData.progress[id] || 0 : 0);

  const value = {
    userData,
    myList: userData.myList,
    liked: userData.liked,
    progress: userData.progress,
    trailers: userData.trailers,
    toggleMyList,
    toggleLike,
    setProgress,
    markTrailerWatched,
    resetAll,
    isInMyList,
    isLiked,
    getProgress,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return ctx;
}

export default UserDataContext;

