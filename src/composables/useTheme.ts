import { ref, computed } from 'vue';

export type Theme = 'light';

const theme = ref<Theme>('light');
let initialized = false;

export function useTheme() {
  const initTheme = () => {
    if (!initialized) {
      theme.value = 'light';
      applyTheme();
      initialized = true;
    }
  };

  const isDark = computed(() => false);

  const applyTheme = () => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  };

  const setTheme = (_next: Theme) => {
    theme.value = 'light';
    localStorage.setItem('theme', 'light');
    applyTheme();
  };

  const toggleTheme = () => {
    setTheme('light');
  };

  return {
    theme,
    isDark,
    initTheme,
    setTheme,
    toggleTheme,
  };
}
