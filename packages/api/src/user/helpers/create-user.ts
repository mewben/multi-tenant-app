import { type User } from "@prisma/client";
import type { WithContext } from "@acme/shared";

// import { UserModel } from "../model";
import { UserModel } from "~/api/user/model";

interface Props extends WithContext {
  input: Partial<User>;
}

// this function solely creates the user record
export const createUser = async ({ input, ctx }: Props) => {
  const model = new UserModel({ ctx });
  const doc = await model.prepareDoc({ input });
  return model.insert(doc);
};
