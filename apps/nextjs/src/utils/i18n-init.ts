import { InstancePlugin } from "@acme/shared";
import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

const config = {
  debug: process.env.NODE_ENV === "development",
  partialBundledLanguages: true,
  resources: {},
  ns: ["common", "error"],
  lng: "en", // if you're using a language detector, do not define the lng option
  fallbackLng: (code: string) => {
    // en-US will fallback to 'en'
    const fallbacks = [code];

    // add pure lang
    const langPart = code.split("-")[0] || "";
    if (langPart !== code) fallbacks.push(langPart);

    // finally, developer language
    // fallbacks.push('dev')
    return fallbacks;
  },
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  returnNull: false,
};

const initialize = () => {
  const instance = i18next.createInstance(config);

  if (!instance.isInitialized) {
    instance.use(InstancePlugin);
    instance.use(initReactI18next);
    instance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.js`),
      ),
    );
    void instance.init(config);
  }
};

initialize();
