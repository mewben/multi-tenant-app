import { find, isEmpty } from "lodash";
import { AUTH_PROVIDERS } from "@acme/db";
import {
  throwError,
  type VerifyUserInput,
  type WithContext,
} from "@acme/shared";

import { UserModel } from "../model";

interface Props extends WithContext {
  input: VerifyUserInput;
}

export const verify = async ({ input, ctx }: Props) => {
  const userModel = new UserModel({ ctx });

  const user = await userModel._collection.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      emailVerified: true,
      accounts: {
        select: {
          provider: true,
          providerAccountId: true,
          verificationCode: true,
        },
      },
    },
  });

  if (!user) {
    return throwError("tn.error:user.notFound");
  }

  if (user.emailVerified) {
    return throwError("tn.error:user.alreadyVerified");
  }

  // get credentials account
  const credentialsAccount = find(user.accounts, {
    provider: AUTH_PROVIDERS.credentials,
  });

  if (isEmpty(credentialsAccount)) {
    return throwError("tn.error:user.noCredentialsAccount");
  }

  // check verificationCode
  if (input.verificationCode !== credentialsAccount.verificationCode) {
    return throwError("tn.error:user.incorrectVerificationCode");
  }

  // all pass, update emailVerified
  return userModel.update(user.id, { emailVerified: new Date() });
};
