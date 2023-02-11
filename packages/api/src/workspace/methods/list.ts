import type { WithContext } from "@acme/shared";

import { ProfileModel } from "~/api/profile/model";

// lists workspaces by current user
export const list = async ({ ctx }: WithContext) => {
  const profileModel = new ProfileModel({ ctx });
  return profileModel._collection.findMany({
    where: {
      userId: ctx.session?.user?.id,
    },
    select: {
      id: true,
      firstName: true,
      workspace: {
        select: {
          id: true,
          domain: true,
          title: true,
        },
      },
    },
  });
};
