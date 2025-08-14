// utils/userStorage.ts
import { UserInfo } from '../types/types';

export const getUserDataFromStorageAll = (): UserInfo | null => {
  const storedData = localStorage.getItem('userInfo');
  if (!storedData) return null;

  try {
    const parsed: UserInfo = JSON.parse(storedData);
    return parsed;
  } catch (err) {
    console.error('فشل في قراءة بيانات المستخدم:', err);
    return null;
  }
};