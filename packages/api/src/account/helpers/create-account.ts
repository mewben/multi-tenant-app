import type { WithContext } from "@acme/shared";

import { AccountModel } from "~/api/account/model";
import { hashPassword } from "./hash-password";

interface Props extends WithContext {
  input: Record<string, any>;
}

export const createAccount = async ({ input, ctx }: Props) => {
  const [hashedPassword, salt] = hashPassword(input.password as string);
  delete input.password;

  const accountModel = new AccountModel({ ctx });
  const doc = await accountModel.prepareDoc({
    input: { ...input, hashedPassword, salt },
  });
  return accountModel.insert(doc);
};
