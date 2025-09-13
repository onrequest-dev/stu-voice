'use client';
import { useTheme } from './ThemeProvider';

export default function ThemeToggleButton() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded"
    >
      {darkMode ? 'الوضع الفاتح' : 'الوضع الليلي'}
    </button>
  );
}
