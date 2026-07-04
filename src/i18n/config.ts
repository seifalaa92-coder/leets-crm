/**
 * Internationalization Configuration
 * 
 * Supports English (LTR) and Arabic (RTL)
 * Automatically handles language switching and RTL layout
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/common.json';
import arTranslations from './locales/ar/common.json';

export const defaultNS = 'common';

export const resources = {
  en: {
    common: enTranslations,
  },
  ar: {
    common: arTranslations,
  },
} as const;

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// Language configuration
export const languages = [
  { code: 'en', name: 'English', dir: 'ltr', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
] as const;

export type LanguageCode = typeof languages[number]['code'];
