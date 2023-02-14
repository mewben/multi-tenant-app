import { changeLanguage as changeLang, type WithChildren } from "@acme/shared";
import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

interface I18nContextType {
  lang: string;
  changeLanguage: (lang: string) => Promise<void>;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }: WithChildren) => {
  const [lang, setLang] = useState<string>("en");
  const { ready } = useTranslation();

  const changeLanguage = async (lang: string) => {
    await changeLang(lang);
    setLang(lang);
  };

  return (
    <I18nContext.Provider value={{ lang, changeLanguage }}>
      {!ready ? <>Loading i18n</> : <>{children}</>}
    </I18nContext.Provider>
  );
};

export const useI18nContext = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("I18n Context not found");
  }

  return context;
};
