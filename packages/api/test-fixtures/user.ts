import { faker } from "@faker-js/faker";
import { AUTH_PROVIDERS, prisma } from "@acme/db";
import {
  getDomainUrl,
  type OnboardingInput,
  type SignupInput,
} from "@acme/shared";

import { getCurrentUser } from "~/api/user/helpers/get-current-user";
import { signup } from "~/api/user/helpers/signup";
import { onboard, verify } from "~/api/user/methods";
import { createSession } from "./mock-current-user";

interface CreateUserProps {
  input?: Partial<SignupInput & OnboardingInput>;
  shouldVerify?: boolean;
  shouldOnboard?: boolean;
}

export const user = {
  create: async ({
    input,
    shouldVerify = true,
    shouldOnboard = true,
  }: CreateUserProps = {}) => {
    const ctx = {
      prisma,
      session: null,
      headers: { host: getDomainUrl({ includeProtocol: false }) },
    };
    let domain = process.env.NEXT_PUBLIC_APP_SUBDOMAIN;

    const signupInput = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(12),
      ...input,
    };
    const user = await signup({ input: signupInput });

    if (shouldVerify) {
      // get verificationCode first in the account
      const account = await prisma.account.findUniqueOrThrow({
        where: {
          provider_providerAccountId: {
            provider: AUTH_PROVIDERS.credentials,
            providerAccountId: user.id,
          },
        },
      });
      await verify({
        input: {
          id: user.id,
          verificationCode: account.verificationCode as string,
        },
        ctx,
      });

      if (shouldOnboard) {
        const session = await createSession(
          await getCurrentUser({
            userId: user.id,
            ctx,
          }),
        );
        const onboardRes = await onboard({
          input: {
            firstName: input?.firstName ?? faker.name.firstName(),
            workspaceTitle: input?.workspaceDomain ?? faker.random.words(2),
            workspaceDomain:
              input?.workspaceDomain ?? faker.random.alphaNumeric(12),
          },
          ctx: {
            ...ctx,
            session,
          },
        });
        domain = onboardRes.domain;
      }
    }

    return await getCurrentUser({
      userId: user.id,
      ctx: {
        ...ctx,
        headers: { host: getDomainUrl({ domain, includeProtocol: false }) },
      },
    });
  },
};
