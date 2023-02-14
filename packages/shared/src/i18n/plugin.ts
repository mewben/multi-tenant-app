// https://github.dev/i18next/react-i18next/blob/master/src/index.js
import { i18n, ModuleType } from "i18next";

import { setInstance } from "./instance";

export const InstancePlugin = {
  type: "3rdParty" as ModuleType,

  init(instance: i18n) {
    setInstance(instance);
  },
};
