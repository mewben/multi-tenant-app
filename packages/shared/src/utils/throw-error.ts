import { t } from "../i18n";

export const throwError = (errorMsg: string, meta?: any) => {
  const msg = t(errorMsg, meta);
  throw new Error(msg);
};
