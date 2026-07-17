import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./LanguageContext";
import { languages, translations } from "../i18n/translations";
import { translatePageText } from "../i18n/pageTranslations";

const STORAGE_KEY = "vms-language";
const supportedCodes = new Set(languages.map(({ code }) => code));
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
const translatableAttributes = ["placeholder", "title", "aria-label", "alt"];
const canTranslateNode = (node) => {
  const parent = node.parentElement;
  return (
    parent &&
    !["SCRIPT", "STYLE", "CODE", "PRE", "OPTION"].includes(parent.tagName) &&
    !parent.closest("[data-no-translate]")
  );
};

function localizeElement(root, language, refreshOriginal = false) {
  const elements =
    root.nodeType === Node.ELEMENT_NODE
      ? [root, ...root.querySelectorAll("*")]
      : [];
  elements.forEach((element) => {
    if (
      ["SCRIPT", "STYLE", "CODE", "PRE"].includes(element.tagName) ||
      element.closest("[data-no-translate]")
    )
      return;
    let attributes = originalAttributes.get(element) || {};
    translatableAttributes.forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const current = element.getAttribute(attribute);
      if (refreshOriginal || !(attribute in attributes))
        attributes = { ...attributes, [attribute]: current };
      element.setAttribute(
        attribute,
        language === "en"
          ? attributes[attribute]
          : translatePageText(attributes[attribute], language),
      );
    });
    originalAttributes.set(element, attributes);
  });

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (canTranslateNode(node)) {
      if (refreshOriginal || !originalText.has(node))
        originalText.set(node, node.data);
      const source = originalText.get(node);
      node.data =
        language === "en" ? source : translatePageText(source, language);
    }
    node = walker.nextNode();
  }
}

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
      translations[language]?.[key] ?? translations.en[key] ?? fallback ?? key,
    [language],
  );
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    localizeElement(document.body, language);

    const observer = new MutationObserver((mutations) => {
      observer.disconnect();
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          if (!canTranslateNode(mutation.target)) return;
          originalText.set(mutation.target, mutation.target.data);
          const source = originalText.get(mutation.target);
          mutation.target.data =
            language === "en" ? source : translatePageText(source, language);
        } else if (mutation.type === "attributes") {
          localizeElement(mutation.target, language, true);
        } else {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              if (!canTranslateNode(node)) return;
              originalText.set(node, node.data);
              node.data =
                language === "en"
                  ? node.data
                  : translatePageText(node.data, language);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              localizeElement(node, language, true);
            }
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
