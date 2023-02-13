import {
  CurrentProfile,
  type CreateWorkspaceInput,
  type WithContext,
} from "@acme/shared";

import { createProfile } from "~/api/profile/helpers/create-profile";
import { getCurrentProfileFromContext } from "~/api/utils/get-current-user-from-context";
import { createWorkspace } from "../helpers/create-workspace";

interface CreateWorkspaceProps extends WithContext {
  input: CreateWorkspaceInput;
}

export const create = async ({ input, ctx }: CreateWorkspaceProps) => {
  const oldTx = ctx.tx;
  // const currentProfile = getCurrentProfileFromContext(ctx) as CurrentProfile;

  return await ctx.prisma.$transaction(async (tx) => {
    ctx.tx = oldTx ?? tx;

    const { workspace, role } = await createWorkspace({ input, ctx });

    // create new profile with this workspace
    await createProfile({
      input: {
        firstName: ctx.session?.user?.name ?? "Name",
        workspaceId: workspace.id,
        roleId: role.id,
        userId: ctx.session?.user?.id as string,
      },
      ctx,
      insertOpts: { skipBase: true },
    });

    // important to put back ctx.tx after to avoid overlap
    ctx.tx = oldTx;
    return workspace;
  });
};
