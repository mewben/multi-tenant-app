import { faker } from "@faker-js/faker";
import { pick } from "lodash";
import { AUTH_PROVIDERS, prisma } from "@acme/db";

import { signup } from "./signup";

describe("auth.signup [credentials]", () => {
  it("should successfully signup", async () => {
    const input = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(12),
    };

    // should return user model
    const user = await signup({ input });
    expect(user.id).not.toBeNull();
    expect(user.createdAt).not.toBeNull();
    expect(user.updatedAt).not.toBeNull();
    expect(pick(user, "name", "email", "emailVerified", "image")).toEqual({
      name: input.name,
      email: input.email,
      emailVerified: null,
      image: null,
    });

    // assert account
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        provider_providerAccountId: {
          provider: AUTH_PROVIDERS.credentials,
          providerAccountId: user.id,
        },
      },
    });
    expect(account.id).not.toBeNull();
    expect(account.verificationCode?.length).toEqual(6);
    expect(account.hashedPassword).not.toEqual(input.password);
    expect(account.salt).not.toBeNull();
    expect(account.resetToken).toBeNull();
    expect(account.resetTokenExpiresAt).toBeNull();
  });

  it("should validate input", async () => {
    const input = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(12),
    };

    // should return user model
    await signup({ input });

    const cases = [
      {
        input: { ...input },
        err: `tn.error:email.duplicate`,
      },
      {
        input: { ...input, name: "" },
        err: `tn.error:name.required`,
      },
      {
        input: { ...input, email: "" },
        err: `tn.error:email.required`,
      },
      {
        input: { ...input, email: "invalidemail" },
        err: `tn.error:email.invalid`,
      },
      {
        input: { ...input, password: "" },
        err: `tn.error:password.required`,
      },
      {
        input: { ...input, password: "123" },
        err: `tn.error:password.too_small`,
      },
    ];

    for (const c of cases) {
      await expect(signup({ input: c.input })).rejects.toThrowError(c.err);
    }
  });
});
