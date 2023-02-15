import { AUTH_PROVIDERS } from "@acme/db";
import {
  throwError,
  type ResetPasswordInput,
  type WithContext,
} from "@acme/shared";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { hashPassword } from "~/api/account/helpers/hash-password";
import { AccountModel } from "~/api/account/model";
import { UserModel } from "../model";

interface Props extends WithContext {
  input: ResetPasswordInput;
}
export const resetPassword = async ({ input, ctx }: Props) => {
  // get the user with account type credentials
  const userModel = new UserModel({ ctx });
  const user = await userModel._collection.findUnique({
    where: {
      email: input.email,
    },
    include: {
      accounts: {
        where: {
          provider: AUTH_PROVIDERS.credentials,
        },
        select: {
          id: true,
          resetToken: true,
          resetTokenExpiresAt: true,
        },
      },
    },
  });

  if (!user || isEmpty(user.accounts)) {
    return throwError("tn.errors:user.notFound");
  }

  const doc = user.accounts[0];

  // const accountModel = new AccountModel({ ctx });
  // const doc = await accountModel.findByProviderAndProviderAccountId({ provider: AUTH_PROVIDERS.credentials, providerAccountId:  shouldThrow: true });

  // check resetToken and expiry
  if (doc?.resetToken !== input.resetToken) {
    return throwError(`tn.errors:auth.resetTokenMismatch`);
  }
  if (dayjs().isAfter(dayjs(doc?.resetTokenExpiresAt))) {
    return throwError(`tn.errors:auth.resetTokenExpired`);
  }

  // set new password and salt
  const [hashedPassword, salt] = hashPassword(input.newPassword);

  const accountModel = new AccountModel({ ctx });
  await accountModel._collection.update({
    where: { id: doc.id },
    data: {
      hashedPassword,
      salt,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  return true;
};
