import { ref, computed } from 'vue';

export type Theme = 'light' | 'dark';

const theme = ref<Theme>('light');
let initialized = false;

export function useTheme() {
  const initTheme = () => {
    if (!initialized) {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        theme.value = stored;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme.value = 'dark';
      } else {
        theme.value = 'light';
      }
      applyTheme();
      initialized = true;
    }
  };

  const isDark = computed(() => theme.value === 'dark');

  const applyTheme = () => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = (next: Theme) => {
    theme.value = next;
    localStorage.setItem('theme', next);
    applyTheme();
  };

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    isDark,
    initTheme,
    setTheme,
    toggleTheme,
  };
}
