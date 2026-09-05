import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { T, dirFor, type Lang, type Dict } from "./strings";

interface LangCtx {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: Dict;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

// Default = English, so components render correctly WITHOUT a provider (keeps tests provider-free).
const Ctx = createContext<LangCtx>({
  lang: "en",
  dir: "ltr",
  t: T.en,
  setLang: () => {},
  toggle: () => {},
});

function readInitial(): Lang {
  try {
    const v = localStorage.getItem("adpic.lang");
    if (v === "ar" || v === "en") return v;
  } catch { /* private mode / no storage */ }
  return "en";
}

export function LangProvider({ children, initial }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLangState] = useState<Lang>(() => initial ?? readInitial());

  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("lang", lang);
    el.setAttribute("dir", dirFor(lang));
    try { localStorage.setItem("adpic.lang", lang); } catch { /* ignore */ }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((l) => (l === "en" ? "ar" : "en")), []);
  const value = useMemo<LangCtx>(() => ({ lang, dir: dirFor(lang), t: T[lang], setLang, toggle }), [lang, setLang, toggle]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  return useContext(Ctx);
}
