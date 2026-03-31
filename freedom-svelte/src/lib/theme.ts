import { writable } from 'svelte/store';

// Default values
const defaultHue = 150; // A nice green/teal starting point
const defaultDark = false;

function createThemeStore() {
  const isBrowser = typeof window !== 'undefined';
  
  const initialHue = isBrowser ? parseInt(localStorage.getItem('themeHue') || String(defaultHue), 10) : defaultHue;
  const initialDark = isBrowser ? localStorage.getItem('theme') === 'dark' : defaultDark;

  const { subscribe, set, update } = writable({ hue: initialHue, isDark: initialDark });

  return {
    subscribe,
    setHue: (hue: number) => update(state => {
      if (isBrowser) {
        localStorage.setItem('themeHue', String(hue));
        document.documentElement.style.setProperty('--theme-hue', String(hue));
      }
      return { ...state, hue };
    }),
    toggleDark: () => update(state => {
      const isDark = !state.isDark;
      if (isBrowser) {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      }
      return { ...state, isDark };
    }),
    setDark: (isDark: boolean) => update(state => {
      if (isBrowser) {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      }
      return { ...state, isDark };
    }),
    init: () => {
      if (isBrowser) {
        document.documentElement.style.setProperty('--theme-hue', String(initialHue));
        document.documentElement.setAttribute('data-theme', initialDark ? 'dark' : 'light');
      }
    }
  };
}

export const themeStore = createThemeStore();
