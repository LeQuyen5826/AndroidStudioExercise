import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';
import en from '../locales/en';
import vi from '../locales/vi';

export type Language = 'auto' | 'vi' | 'en';
export type TKey = keyof typeof en;

const dictionaries = { en, vi };
const LANG_KEY = '@language';

function deviceLanguage(): 'vi' | 'en' {
  const code = getLocales()[0]?.languageCode;
  return code === 'vi' ? 'vi' : 'en';
}

type I18nContextType = {
  lang: Language; // lựa chọn của user: auto | vi | en
  resolved: 'vi' | 'en'; // ngôn ngữ đang hiển thị
  setLang: (l: Language) => void;
  t: (key: TKey, params?: Record<string, string>) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('auto');
  const [ready, setReady] = useState(false);
  const [, force] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY)
      .then((v) => {
        if (v === 'vi' || v === 'en' || v === 'auto') setLangState(v);
      })
      .finally(() => setReady(true));
  }, []);

  // Khi quay lại app (vd: vừa đổi ngôn ngữ trong Settings thiết bị) -> cập nhật lại
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') force((n) => n + 1);
    });
    return () => sub.remove();
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    AsyncStorage.setItem(LANG_KEY, l).catch(() => {});
  }, []);

  const resolved = lang === 'auto' ? deviceLanguage() : lang;

  const t = useCallback(
    (key: TKey, params?: Record<string, string>) => {
      let text: string = dictionaries[resolved][key] ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, v);
        });
      }
      return text;
    },
    [resolved],
  );

  const value = useMemo(() => ({ lang, resolved, setLang, t }), [lang, resolved, setLang, t]);

  if (!ready) return null;
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
