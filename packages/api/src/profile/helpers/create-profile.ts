import type { CreateProfileInput, WithContext } from "@acme/shared";

import { ProfileModel } from "../model";

interface Input extends CreateProfileInput {
  invitationCode?: string;
  workspaceId?: string; // we supply workspaceId for onboard
  userId?: string;
}

interface Props extends WithContext {
  input: Input;
  insertOpts?: Record<string, any>;
}

export const createProfile = async ({ input, ctx, insertOpts }: Props) => {
  const profileModel = new ProfileModel({ ctx });
  const doc = await profileModel.prepareDoc({ input });

  return profileModel.insert({ data: doc, ...insertOpts });
};
