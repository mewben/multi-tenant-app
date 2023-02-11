import { faker } from "@faker-js/faker";
import { Profile } from "@acme/db";
import type { CreateWorkspaceInput, WithContext } from "@acme/shared";

import { createProfile } from "~/api/profile/helpers/create-profile";
import { createWorkspace } from "~/api/workspace/helpers/create-workspace";

interface CreateWorkspaceProps extends WithContext {
  input?: CreateWorkspaceInput;
  shouldCreateProfile?: boolean;
}

export const workspace = {
  create: async ({
    input,
    shouldCreateProfile = true,
    ctx,
  }: CreateWorkspaceProps) => {
    const { workspace, role } = await createWorkspace({
      input: {
        title: faker.random.words(2),
        domain: faker.random.alphaNumeric(8),
        ...input,
      },
      ctx,
    });

    let profile: Profile | null = null;

    if (shouldCreateProfile) {
      profile = await createProfile({
        input: {
          firstName:
            ctx.session?.user?.profile?.firstName || faker.name.firstName(),
          workspaceId: workspace.id,
          roleId: role.id,
          userId: ctx.session?.user?.id as string,
        },
        ctx,
        insertOpts: { skipBase: true },
      });
    }

    return { workspace, role, profile };
  },
};
