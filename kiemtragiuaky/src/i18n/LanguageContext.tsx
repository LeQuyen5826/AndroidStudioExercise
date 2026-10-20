import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { PREFIX } from '../config/student';
import { Dict, en } from './en';
import { vi } from './vi';

type Lang = 'en' | 'vi';
const LANG_KEY = `${PREFIX}Language`;
const dicts: Record<Lang, Dict> = { en, vi };

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Dict) => string;
  err: (code: string) => string; // dịch mã lỗi validation
}

const LanguageContext = createContext<Ctx>(null as unknown as Ctx);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en'); // mặc định English

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((v) => {
      if (v === 'en' || v === 'vi') setLangState(v);
    });
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(LANG_KEY, l);
  };

  const t = (key: keyof Dict) => dicts[lang][key];
  const err = (code: string) =>
    (dicts[lang] as Record<string, string>)[`err_${code}`] ?? code;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, err }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);