import { useEffect, useId, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiGlobe } from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

const variants = {
  auth: {
    trigger: "w-auto min-w-0 rounded-full bg-white/95 px-4 py-2.5 text-[#073978] shadow-lg hover:bg-white focus-visible:ring-white/80",
    menu: "right-0 mt-2 w-56 border-white/70 bg-white/96 shadow-[0_24px_54px_-18px_rgba(1,36,91,0.55)]",
  },
  header: {
    trigger: "min-w-40 rounded-2xl border border-slate-200/80 bg-white/80 px-2 py-1.5 text-slate-700 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.75)] hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white focus-visible:ring-blue-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10 dark:focus-visible:ring-blue-500/30",
    menu: "right-0 mt-3 w-72 border-slate-200/80 bg-white/96 shadow-[0_24px_54px_-18px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/96 dark:shadow-black/40",
  },
  sidebar: {
    trigger: "w-full rounded-2xl border border-slate-200/80 bg-white/85 px-2 py-2 text-slate-700 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.6)] hover:border-blue-200 hover:bg-white focus-visible:ring-blue-200 dark:border-slate-700 dark:bg-slate-800/85 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-500/30",
    menu: "left-0 right-0 mt-2 border-slate-200/80 bg-white/98 shadow-[0_20px_46px_-18px_rgba(15,23,42,0.42)] dark:border-slate-700 dark:bg-slate-900/98 dark:shadow-black/40",
  },
};

export default function LanguageSwitcher({ variant = "header", className = "" }) {
  const { language, languages, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listboxId = useId();
  const style = variants[variant] || variants.header;
  const selectedLanguage = languages.find(({ code }) => code === language) || languages[0];
  const isAuthVariant = variant === "auth";

  useEffect(() => {
    const closeOnOutsidePointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => event.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const chooseLanguage = (code) => {
    setLanguage(code);
    setOpen(false);
  };

  const openAuthMenu = (event) => {
    event.preventDefault();
    setOpen((current) => !current);
  };

  return (
    <div ref={rootRef} className={className} data-no-translate>
      <div className="relative">
      {isAuthVariant ? (
        <label
          className="flex cursor-pointer items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#073978] shadow-lg"
          onMouseDown={openAuthMenu}
        >
          <FiGlobe className="text-lg" aria-hidden="true" />
          <span className="sr-only">{t("language.label", "Language")}</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            onKeyDown={(event) => {
              if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) openAuthMenu(event);
            }}
            aria-label={t("language.label", "Language")}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            className="max-w-24 cursor-pointer appearance-none bg-transparent pr-4 outline-none"
          >
            {languages.map(({ code, nativeLabel }) => <option key={code} value={code}>{nativeLabel}</option>)}
          </select>
          <FiChevronDown className={`pointer-events-none absolute right-3.5 text-xs transition duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </label>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={`group flex w-full items-center gap-2.5 text-left transition duration-200 focus:outline-none focus-visible:ring-4 ${style.trigger}`}
          aria-label={t("language.label", "Language")}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
        >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-[0_6px_14px_-6px_rgba(37,99,235,0.9)]">
              <FiGlobe className="text-[15px]" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-400">
                {t("language.label", "Language")}
              </span>
              <span className="block truncate text-sm font-bold leading-4">{selectedLanguage?.nativeLabel}</span>
            </span>
            <FiChevronDown className={`shrink-0 text-sm text-slate-400 transition duration-200 group-hover:text-blue-500 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      )}

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={t("language.label", "Language")}
          className={`absolute z-[60] overflow-hidden rounded-2xl border p-1.5 backdrop-blur-xl ${style.menu}`}
        >
          <div className="px-3 pb-2 pt-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            {t("language.label", "Language")}
          </div>
          {languages.map(({ code, nativeLabel }) => {
            const selected = code === language;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => chooseLanguage(code)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selected
                  ? "bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-[0_8px_18px_-10px_rgba(37,99,235,0.9)]"
                  : "text-slate-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-blue-500/15"}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold ${selected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                  {code.toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold leading-4">{nativeLabel}</span>
                  <span className={`block text-[11px] ${selected ? "text-blue-100" : "text-slate-400 dark:text-slate-500"}`}>{code === "en" ? "English" : code === "si" ? "Sinhala" : "Tamil"}</span>
                </span>
                {selected && <FiCheck className="shrink-0 text-lg" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
