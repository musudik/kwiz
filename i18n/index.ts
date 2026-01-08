/**
 * KWIZ i18n Hook
 * Hook to access translations based on selected language
 */

import { useSettingsStore } from '@/store';
import { getTranslations, Translations } from './translations';

/**
 * Hook to get translations for the current language
 * @returns Translations object with all text in the selected language
 */
export const useTranslations = (): Translations => {
    const language = useSettingsStore((state) => state.language);
    return getTranslations(language);
};

/**
 * Hook to get a specific translation function
 * Useful for dynamic keys
 */
export const useT = () => {
    const t = useTranslations();
    return t;
};

export { getTranslations, type Translations } from './translations';
