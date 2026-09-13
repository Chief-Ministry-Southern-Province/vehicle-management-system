import { localizeElement } from './localizeDom.js';
import { getCurrentLanguage } from './runtime.js';

export function localizePrintDocument(document) {
  document.documentElement.lang = getCurrentLanguage();
  localizeElement(document.documentElement, getCurrentLanguage());
}
