// import { promises } from "fs";

import { chromium, type FullConfig } from "@playwright/test";

// import { discordSignin } from "./helpers/discord-signin";

// async function isFileExists(path: string) {
//   try {
//     await promises.access(path);
//     return true;
//   } catch {
//     return false;
//   }
// }

const globalSetup = async (config: FullConfig) => {
  // const [project] = config.projects;
  // const { storageState, baseURL } = project.use;
  // const result = await isFileExists(storageState);
  // if (result) {
  //   return;
  // }
  //
  // save discord state signin
  // const browser = await chromium.launch();
  // const page = await browser.newPage();
  // await discordSignin(page);
  // await page.context().storageState({
  //   path: "state.admin.json",
  // });
  // await browser.close();
};

export default globalSetup;
