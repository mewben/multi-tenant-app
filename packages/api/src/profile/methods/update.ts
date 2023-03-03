import { type UpdateUserProfileInput, type WithContext } from "@acme/shared";

import { ProfileModel } from "../model";

interface Props extends WithContext {
  input: UpdateUserProfileInput;
}

export const update = async ({ input, ctx }: Props) => {
  const profileModel = new ProfileModel({ ctx });
  const oldDoc = await profileModel.findById(input.id);

  const doc = await profileModel.prepareDoc({ input, oldDoc });

  return await profileModel.update(input.id, doc);
};
