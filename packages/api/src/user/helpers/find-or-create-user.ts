import type { User } from "@acme/db";
import type { WithContext } from "@acme/shared";

import { UserModel } from "~/api/user/model";

interface Props extends WithContext {
  input: Partial<User>;
}

export const findOrCreateUser = async ({ input, ctx }: Props) => {
  const userModel = new UserModel({ ctx });

  // we return the found user if found
  const user = await userModel.findByEmail(input.email as string);
  if (user) return user;

  const doc = await userModel.prepareDoc({ input });
  return userModel.insert(doc);
};
