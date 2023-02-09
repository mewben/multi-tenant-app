import type { WithContext } from "@acme/shared";

import { RoleModel } from "../model";

export const list = async ({ ctx }: WithContext) => {
  const roleModel = new RoleModel({ ctx });
  return await roleModel.list();
};
