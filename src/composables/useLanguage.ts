import { ref } from 'vue';

const currentLang = ref(localStorage.getItem('lang') || 'EN');

export function useLanguage() {
  const setLanguage = (lang: string) => {
    currentLang.value = lang;
    localStorage.setItem('lang', lang);
  };

  return {
    currentLang,
    setLanguage,
  };
}
