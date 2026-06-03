import { ref, computed } from 'vue';

export type AdminTheme = 'light' | 'dark';

const STORAGE_KEY = 'kdrc-admin-theme';

const theme = ref<AdminTheme>('light');
let initialized = false;

function readStored(): AdminTheme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function useAdminTheme() {
  const initTheme = () => {
    if (!initialized) {
      theme.value = readStored();
      initialized = true;
    }
  };

  const isDark = computed(() => theme.value === 'dark');

  const setTheme = (next: AdminTheme) => {
    theme.value = next;
    localStorage.setItem(STORAGE_KEY, next);
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
