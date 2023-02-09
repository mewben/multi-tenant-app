import type { CreateRoleInput, WithContext } from "@acme/shared";

import { RoleModel } from "../model";

export interface CreateRoleInputProps extends CreateRoleInput {
  workspaceId?: string; // we supply workspaceId for after create hook in workspace
}

interface Props extends WithContext {
  input: CreateRoleInputProps;
  insertOpts?: Record<string, any>;
}

export const create = async ({ input, ctx, insertOpts }: Props) => {
  const roleModel = new RoleModel({ ctx });
  const doc = await roleModel.prepareDoc({ input });

  return roleModel.insert({ data: doc, ...insertOpts });
};
