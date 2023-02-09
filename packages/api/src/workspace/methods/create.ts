import { type CreateWorkspaceInput, type WithContext } from "@acme/shared";

import { WorkspaceModel } from "../model";

interface CreateWorkspaceProps extends WithContext {
  input: CreateWorkspaceInput;
}

export const create = async ({ input, ctx }: CreateWorkspaceProps) => {
  const workspaceModel = new WorkspaceModel({ ctx });
  const doc = await workspaceModel.prepareDoc({ input });

  return await workspaceModel.insert(doc);
};
