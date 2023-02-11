import {
  cleanAndValidate,
  createWorkspaceSchema,
  type CreateWorkspaceInput,
  type WithContext,
} from "@acme/shared";

import { WorkspaceModel } from "../model";

interface CreateWorkspaceProps extends WithContext {
  input: CreateWorkspaceInput;
}

export const createWorkspace = async ({ input, ctx }: CreateWorkspaceProps) => {
  const { data } = cleanAndValidate({ schema: createWorkspaceSchema, input });
  const workspaceModel = new WorkspaceModel({ ctx });
  const doc = await workspaceModel.prepareDoc({
    input: data as CreateWorkspaceInput,
  });

  return await workspaceModel.insert(doc);
};
