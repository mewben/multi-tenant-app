import { getInstance } from "./instance";

export const t = (untranslated = "", meta?: Record<string, any>): string => {
  // we strip off tn.
  const sp = untranslated.split("tn.");
  const un = sp[1] ? sp[1] : untranslated;

  const tn = getInstance();
  if (!tn) return `${untranslated}`;

  const translated = tn.t(un, { interpolation: meta });
  if (translated === un) {
    // log those untranslated
    console.log("UNTRANSLATED: ", un);
  }

  return translated;
};

export const changeLanguage = (lang = "en") => {
  const tn = getInstance();
  return tn.changeLanguage(lang);
};
