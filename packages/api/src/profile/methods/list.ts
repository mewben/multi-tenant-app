import type { WithContext } from "@acme/shared";

import { ProfileModel } from "../model";

export const list = async ({ ctx }: WithContext) => {
  const profileModel = new ProfileModel({ ctx });
  return await profileModel.list();
};
