import { type Workspace } from "@acme/db";
import { type WithContext } from "@acme/shared";

import { create as createRole } from "~/api/role/methods";

export const afterInsert = async (
  newWorkspace: Workspace,
  { ctx }: WithContext,
) => {
  // create default role
  await createRole({
    input: { title: "Admin", isAdmin: true, workspaceId: newWorkspace.id },
    ctx,
    insertOpts: {
      skipBase: true,
    },
  });
};
