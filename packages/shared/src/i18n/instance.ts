import { i18n } from "i18next";

let i18nInstance: i18n;

export function setInstance(instance: i18n) {
  i18nInstance = instance;
}

export function getInstance() {
  return i18nInstance;
}
