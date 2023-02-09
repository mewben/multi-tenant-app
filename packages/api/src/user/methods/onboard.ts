import { isEmpty } from "lodash";
import type { Role } from "@acme/db";
import {
  throwError,
  type OnboardingInput,
  type WithContext,
} from "@acme/shared";

import { createProfile } from "~/api/profile/helpers/create-profile";
import { RoleModel } from "~/api/role/model";
import { create as createWorkspace } from "~/api/workspace/methods";

interface Props extends WithContext {
  input: OnboardingInput;
}
export const onboard = async ({ input, ctx }: Props) => {
  const oldTx = ctx.tx;
  return await ctx.prisma.$transaction(async (tx) => {
    ctx.tx = oldTx ?? tx;

    // create workspace
    const workspace = await createWorkspace({
      input: { title: input.workspaceTitle, domain: input.workspaceDomain },
      ctx,
    });

    // get default role
    const roleModel = new RoleModel({ ctx });
    const roles = await roleModel.listByWorkspace(workspace.id);
    if (isEmpty(roles)) return throwError("tn.error:role.notFound");

    const role = roles[0] as Role;

    // create profile
    await createProfile({
      input: {
        firstName: input.firstName,
        workspaceId: workspace.id,
        roleId: role.id,
        userId: ctx.session?.user?.id as string,
      },
      ctx,
      insertOpts: { skipBase: true },
    });

    // important to put back ctx.tx after to avoid overlap
    ctx.tx = oldTx;
    return { domain: workspace.domain };
  });
};
