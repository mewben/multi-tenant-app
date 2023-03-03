import { type IdInput, type WithContext } from "@acme/shared";

import { ProfileModel } from "../model";

interface Props extends WithContext {
  input: IdInput;
}

export const getById = async ({ input, ctx }: Props) => {
  const profileModel = new ProfileModel({ ctx });

  const res = await profileModel._collection.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      firstName: true,
      image: true,
      workspaceId: true,
      user: {
        select: {
          id: true,
          email: true,
          accounts: {
            select: {
              id: true,
              type: true,
              provider: true,
            },
          },
        },
      },
    },
  });

  if (res?.workspaceId !== profileModel._workspaceId) return null;

  return res;
};
