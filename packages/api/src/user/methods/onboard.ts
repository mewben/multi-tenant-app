import { type OnboardingInput, type WithContext } from "@acme/shared";

import { createProfile } from "~/api/profile/helpers/create-profile";
import { createWorkspace } from "~/api/workspace/helpers/create-workspace";

interface Props extends WithContext {
  input: OnboardingInput;
}
export const onboard = async ({ input, ctx }: Props) => {
  const oldTx = ctx.tx;
  return await ctx.prisma.$transaction(async (tx) => {
    ctx.tx = oldTx ?? tx;

    // create workspace
    const { workspace, role } = await createWorkspace({
      input: { title: input.workspaceTitle, domain: input.workspaceDomain },
      ctx,
    });

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
