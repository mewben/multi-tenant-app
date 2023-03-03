import { AUTH_PROVIDERS, PROVIDER_TYPES } from "@prisma/client";
import { pick } from "lodash";
import { prisma } from "@acme/db";
import {
  cleanAndValidate,
  getDomainUrl,
  signupSchema,
  type Context,
  type SignupInput,
} from "@acme/shared";

import { createAccount } from "~/api/account/helpers/create-account";
import { sendEmail } from "~/api/utils/send-email";
import { createUser } from "./create-user";

interface Props {
  input: SignupInput;
}
// signup method for credentials provider
export const signup = async ({ input }: Props) => {
  // validate input here since we are calling this from next-auth
  const { data } = cleanAndValidate({ schema: signupSchema, input });

  return await prisma.$transaction(async (tx) => {
    const ctx: Context = {
      prisma,
      tx,
      session: null,
      headers: {},
    };

    // create user
    const user = await createUser({
      input: pick(data, "name", "email", "image"),
      ctx,
    });

    // create account
    const account = await createAccount({
      input: {
        userId: user.id,
        providerAccountId: user.id,
        password: data?.password as string,
        provider: AUTH_PROVIDERS.credentials,
        type: PROVIDER_TYPES.credentials,
      },
      ctx,
    });

    // send verification link
    // http://app.mta.localhost:3000/verify-user?userId=fa42a6a3-f3b5-43ed-8525-ac849213a7ec&verificationCode=12345
    const verificationLink =
      getDomainUrl() +
      `/verify-user?userId=${user.id}&verificationCode=${account.verificationCode}`;

    if (process.env.NODE_ENV !== "production") {
      console.log("--- VERIFICATION LINK: ", verificationLink);
    }
    void sendEmail({
      to: user.email as string,
      subject: "TODO: Welcome. Please verify your account.",
      text: `Verification Link: ${verificationLink}`,
    });

    return user;
  });
};
