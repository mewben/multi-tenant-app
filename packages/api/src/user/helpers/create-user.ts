import type { User } from "@acme/db";
import type { WithContext } from "@acme/shared";

import { UserModel } from "~/api/user/model";

interface Props extends WithContext {
  input: Partial<User>;
}

// this function solely creates the user record
export const createUser = async ({ input, ctx }: Props) => {
  const userModel = new UserModel({ ctx });
  const doc = await userModel.prepareDoc({ input });
  return userModel.insert(doc);
};
