import { AUTH_PROVIDERS } from "@acme/db";
import {
  randomCuid,
  throwError,
  type ForgotPasswordInput,
  type WithContext,
} from "@acme/shared";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { AccountModel } from "~/api/account/model";
import { UserModel } from "../model";

interface Props extends WithContext {
  input: ForgotPasswordInput;
}
export const forgotPassword = async ({ input, ctx }: Props) => {
  // get the user by email with account type credentials
  const userModel = new UserModel({ ctx });
  const doc = await userModel._collection.findUnique({
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
          resetTokenExpiresAt: true,
        },
      },
    },
  });

  if (!doc || isEmpty(doc.accounts)) {
    return throwError("tn.errors:user.notFound");
  }

  // TODO: throw error if already requested this within 5 mins

  // set reset token
  const accountModel = new AccountModel({ ctx });
  const updated = await accountModel._collection.update({
    where: {
      id: doc.accounts[0]?.id,
    },
    data: {
      resetToken:
        process.env.NODE_ENV !== "production"
          ? process.env.RESET_TOKEN
          : randomCuid(),
      resetTokenExpiresAt: dayjs().add(1, "hour").toDate(),
    },
  });

  // TODO: send reset password link
  // /reset-password?email=email&resetToken=token

  console.log("aaa updated:", updated);

  return true;
};
