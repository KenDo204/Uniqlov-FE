import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === 'light' ? 'dark' : 'light';
          const root = window.document.documentElement;
          if (nextTheme === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
          return { theme: nextTheme };
        }),
      setTheme: (theme) => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
