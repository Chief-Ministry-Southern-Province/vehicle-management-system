import { translatePageText } from './translate.js';

export function getCurrentLanguage() {
  try {
    const language = globalThis.localStorage?.getItem('vms-language');
    return ['en', 'si', 'ta'].includes(language) ? language : 'en';
  } catch {
    return 'en';
  }
}

export const getCurrentLocale = () => `${getCurrentLanguage()}-LK`;
export const translateCurrentText = (text) => translatePageText(text, getCurrentLanguage());
export const confirmLocalized = (message) => window.confirm(translateCurrentText(message));
export const alertLocalized = (message) => window.alert(translateCurrentText(message));
