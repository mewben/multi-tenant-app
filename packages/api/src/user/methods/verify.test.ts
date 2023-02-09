import { faker } from "@faker-js/faker";
import { AUTH_PROVIDERS, prisma } from "@acme/db";

import { type RouterInputs } from "~/api/root";
import { signup } from "~/api/user/helpers/signup";
import "jest-date-2";
import { randomId } from "@acme/shared";

import fixtures from "~/api/fixtures";

describe("user.verify [credentials]", () => {
  it("should successfully verify an unverified user", async () => {
    const user = await signup({
      input: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(8),
      },
    });

    const account = await prisma.account.findUniqueOrThrow({
      where: {
        provider_providerAccountId: {
          provider: AUTH_PROVIDERS.credentials,
          providerAccountId: user.id,
        },
      },
    });
    expect(user.emailVerified).toBeNull();

    // verify
    const { caller } = fixtures.mockCurrentUser();

    const input: RouterInputs["user"]["verify"] = {
      id: user.id,
      verificationCode: account.verificationCode || "",
    };
    const response = await caller.user.verify(input);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(response?.emailVerified).toBeWithinMinuteAs(new Date());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(response?.updatedAt).toBeWithinMinuteAs(new Date());
    expect(response?.updatedAt).not.toEqual(response?.createdAt);
  });

  // TODO: createCaller doesn't call errorFormatter
  // so the error message validation thrown from input
  // zod here is not formatted
  it("should validate input", async () => {
    const user1 = await signup({
      input: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(8),
      },
    });
    const account1 = await prisma.account.findUniqueOrThrow({
      where: {
        provider_providerAccountId: {
          provider: AUTH_PROVIDERS.credentials,
          providerAccountId: user1.id,
        },
      },
    });

    // verified user
    const user2 = await signup({
      input: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(8),
      },
    });
    const account2 = await prisma.account.findUniqueOrThrow({
      where: {
        provider_providerAccountId: {
          provider: AUTH_PROVIDERS.credentials,
          providerAccountId: user2.id,
        },
      },
    });
    const { caller } = fixtures.mockCurrentUser();
    await caller.user.verify({
      id: user2.id,
      verificationCode: account2.verificationCode || "",
    });

    const cases = [
      {
        input: {
          id: "",
          verificationCode: "235335",
        },
        err: "invalid_string", // "tn.validation:id.required",
      },
      {
        input: { id: "", verificationCode: "" },
        err: "invalid_string", // "tn.validation:id.invalid_string",
      },
      {
        input: {
          id: user1.id,
          verificationCode: "",
        },
        err: "too_small", // "tn.validation:verificationCode.required",
      },
      {
        input: {
          id: user1.id,
          verificationCode: "33",
        },
        err: "too_small", // "tn.validation:verificationCode.required",
      },
      {
        input: {
          id: user1.id,
          verificationCode: "somethingincorrect",
        },
        err: "tn.error:user.incorrectVerificationCode",
      },
      {
        input: {
          id: randomId(),
          verificationCode: account1.verificationCode || "",
        },
        err: "tn.error:user.notFound",
      },
      {
        input: {
          id: user2.id,
          verificationCode: account2.verificationCode || "",
        },
        err: "tn.error:user.alreadyVerified",
      },
      {
        input: {
          id: user1.id,
          verificationCode: "incorrect",
        },
        err: "tn.error:user.incorrectVerificationCode",
      },
    ];

    for (const c of cases) {
      await expect(caller.user.verify(c.input)).rejects.toThrowError(c.err);
    }
  });
});
