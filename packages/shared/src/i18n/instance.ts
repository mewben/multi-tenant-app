interface I18nInstance {
  t: (un: string, meta: any) => string;
}

let i18nInstance: I18nInstance;

export function setInstance(instance: I18nInstance) {
  i18nInstance = instance;
}

export function getInstance() {
  return i18nInstance;
}
