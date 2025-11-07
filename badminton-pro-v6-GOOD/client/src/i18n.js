import en from './i18n/en.json'; import ta from './i18n/ta.json';
import React, { createContext, useContext, useState, useMemo } from 'react';
const dict = { en, ta };
const I18nCtx = createContext();
export function I18nProvider({ children }){
  const [lang,setLang] = useState(localStorage.getItem('lang') || 'en');
  const t = useMemo(()=> (k)=> dict[lang][k] || k, [lang]);
  const change = (l)=>{ setLang(l); localStorage.setItem('lang', l) };
  return <I18nCtx.Provider value={{ t, lang, change }}>{children}</I18nCtx.Provider>
}
export function useI18n(){ return useContext(I18nCtx) }
