import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { AUTH_PROVIDERS } from "@acme/db";
import { logger } from "@acme/logger";
import {
  getDomainUrl,
  randomCuid,
  throwError,
  type ForgotPasswordInput,
  type WithContext,
} from "@acme/shared";

import { AccountModel } from "~/api/account/model";
import { sendEmail } from "~/api/utils/send-email";
import { UserModel } from "../model";

interface Props extends WithContext {
  input: ForgotPasswordInput;
}

// TODO: if not in main subdomain, restrict email if found inside that workspace
export const forgotPassword = async ({ input, ctx }: Props) => {
  const isDev = process.env.NODE_ENV !== "production";

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
      resetToken: isDev ? process.env.RESET_TOKEN : randomCuid(),
      resetTokenExpiresAt: dayjs().add(1, "hour").toDate(),
    },
  });

  // send reset password link
  // /reset-password?email=email&resetToken=token
  const resetPasswordLink =
    getDomainUrl() +
    `/reset-password?email=${doc.email}&resetToken=${updated.resetToken}`;

  logger.debug(`--- RESET PASSWORD LINK: ${resetPasswordLink}`);

  void sendEmail({
    to: input.email,
    subject: "TODO: Reset Password",
    text: `Reset Password Link: ${resetPasswordLink}`,
  });

  return true;
};
