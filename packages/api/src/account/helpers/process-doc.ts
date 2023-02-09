import { includes, random } from "lodash";
import { AUTH_PROVIDERS, type Account, type Prisma, type User } from "@acme/db";
import { getObjectDifference, throwError } from "@acme/shared";

import type { AccountModel } from "~/api/account/model";
import { UserModel } from "~/api/user/model";

export type ProcessDocProps = {
  input: Partial<Account>;
  oldDoc?: Account;
};

interface Props extends ProcessDocProps {
  model: AccountModel;
}

export const processDoc = async ({ input, oldDoc, model }: Props) => {
  const isInsert = !oldDoc;

  const upd = getObjectDifference(
    input,
    oldDoc,
  ) as Prisma.AccountUncheckedCreateInput;

  if (isInsert) {
    // check for duplicate account
    if (upd.provider && upd.providerAccountId) {
      const foundAccount = await model.findByProviderAndProviderAccountId({
        provider: upd.provider,
        providerAccountId: upd.providerAccountId,
      });
      if (foundAccount) {
        return throwError(`tn.error:account.duplicate`);
      }
    }

    if (upd.provider === AUTH_PROVIDERS.credentials) {
      // get user
      const userModel = new UserModel({ ctx: model._ctx });
      const user = (await userModel.findById({
        id: upd.userId,
        shouldThrow: true,
      })) as User;

      upd.verificationCode = `${random(100000, 999999)}`;

      if (
        process.env.NODE_ENV !== "production" &&
        includes(user.email, "test.com")
      ) {
        // this is for testing/development purposes
        upd.verificationCode = process.env.VERIFICATION_CODE || "123456";
      }
    }
  }

  return upd;
};
