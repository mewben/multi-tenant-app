import { AUTH_PROVIDERS, type Account } from "@acme/db";
import {
  throwError,
  type UpdatePasswordInput,
  type WithContext,
} from "@acme/shared";

import { hashPassword } from "~/api/account/helpers/hash-password";
import { AccountModel } from "~/api/account/model";

interface Props extends WithContext {
  input: UpdatePasswordInput;
}
export const updatePassword = async ({ input, ctx }: Props) => {
  const accountModel = new AccountModel({ ctx });
  const oldDoc = (await accountModel.findByProviderAndProviderAccountId({
    provider: AUTH_PROVIDERS.credentials,
    providerAccountId: ctx.session?.user?.id as string,
    shouldThrow: true,
  })) as unknown as Account;

  // check current password
  const [hashedPassword] = hashPassword(
    input.currentPassword,
    oldDoc.salt ?? "",
  );
  if (hashedPassword !== oldDoc.hashedPassword) {
    return throwError(`tn.error:auth.invalidCredentials`);
  }

  // set new password
  const [newHashedPassword, salt] = hashPassword(input.newPassword);

  return await accountModel._collection.update({
    where: {
      id: oldDoc.id,
    },
    data: {
      hashedPassword: newHashedPassword,
      salt,
    },
  });
};
