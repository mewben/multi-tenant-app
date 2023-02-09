// import { createAccount } from "@/server/account/helpers/create-account";
// import { createUser } from "@/server/user/helpers/create-user";
import { AUTH_PROVIDERS, PROVIDER_TYPES } from "@prisma/client";
import { pick } from "lodash";
import type { Context } from "@acme/auth";
import { prisma } from "@acme/db";
import { SignupInput, cleanAndValidate, signupSchema } from "@acme/shared";

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

    // TODO: send verification link

    return user;
  });
};
