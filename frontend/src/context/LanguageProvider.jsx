import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./LanguageContext";
import { languages, translations } from "../i18n/translations";
import { translatePageText } from "../i18n/translate";
import { localizeElement, translatableAttributes } from "../i18n/localizeDom";

const STORAGE_KEY = "vms-language";
const supportedCodes = new Set(languages.map(({ code }) => code));

export default function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!supportedCodes.has(saved)) {
      localStorage.setItem(STORAGE_KEY, "en");
      return "en";
    }
    return saved;
  });
  const setLanguage = useCallback((code) => {
    if (!supportedCodes.has(code)) return;
    localStorage.setItem(STORAGE_KEY, code);
    setLanguageState(code);
  }, []);
  const t = useCallback(
    (key, fallback) =>
      translatePageText(translations[language]?.[key] ?? translations.en[key] ?? fallback ?? key, language),
    [language],
  );
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    localizeElement(document.body, language);

    const observer = new MutationObserver((mutations) => {
      observer.disconnect();
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData" || mutation.type === "attributes") {
          localizeElement(mutation.target, language);
        } else {
          mutation.addedNodes.forEach((node) => {
            localizeElement(node, language);
          });
        }
      });
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: translatableAttributes,
      });
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: translatableAttributes,
    });
    return () => observer.disconnect();
  }, [language]);
  const locale =
    languages.find(({ code }) => code === language)?.locale || "en-LK";
  const translate = useCallback(
    (text) => translatePageText(text, language),
    [language],
  );
  const value = useMemo(
    () => ({ language, languages, locale, setLanguage, t, translate }),
    [language, locale, setLanguage, t, translate],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
