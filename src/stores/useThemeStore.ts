import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store';
import { toggleTheme, setTheme } from './themeSlice';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export function useThemeStore(): ThemeStore;
export function useThemeStore<T>(selector: (state: ThemeStore) => T): T;
export function useThemeStore<T>(selector?: (state: ThemeStore) => T): T | ThemeStore {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  const store: ThemeStore = {
    theme,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (t) => dispatch(setTheme(t)),
  };

  if (selector) {
    return selector(store);
  }
  return store;
}
