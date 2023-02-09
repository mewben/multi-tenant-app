import { faker } from "@faker-js/faker";
import { AUTH_PROVIDERS, PROVIDER_TYPES } from "@acme/db";

import fixtures from "~/api/fixtures";
import { createUser } from "~/api/user/helpers/create-user";
import { createAccount } from "./create-account";

describe("account.create", () => {
  it("should create an account", async () => {
    const { ctx } = fixtures.mockCurrentUser();

    const user = await createUser({
      input: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
      },
      ctx,
    });

    const input = {
      userId: user.id,
      providerAccountId: user.id,
      password: faker.random.alphaNumeric(8),
      provider: AUTH_PROVIDERS.credentials,
      type: PROVIDER_TYPES.credentials,
    };

    const account = await createAccount({ input, ctx });
    expect(account.id).not.toBeNull();
    expect(account.verificationCode?.length).toEqual(6);
    expect(account.hashedPassword).not.toEqual(input.password);
    expect(account.salt).not.toBeNull();
    expect(account.resetToken).toBeNull();
    expect(account.resetTokenExpiresAt).toBeNull();
  });

  it("should throw duplicate account", async () => {
    const { ctx } = fixtures.mockCurrentUser();
    const user = await createUser({
      input: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
      },
      ctx,
    });

    const input = {
      userId: user.id,
      providerAccountId: user.id,
      password: faker.random.alphaNumeric(8),
      provider: AUTH_PROVIDERS.credentials,
      type: PROVIDER_TYPES.credentials,
    };
    await createAccount({ input: { ...input }, ctx });

    await expect(createAccount({ input, ctx })).rejects.toThrowError(
      `tn.error:account.duplicate`,
    );
  });
});
