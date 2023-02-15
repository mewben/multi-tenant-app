import { AUTH_PROVIDERS, prisma } from "@acme/db";
import { randomCuid } from "@acme/shared";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import fixtures from "~/api/fixtures";

describe("user.resetPassword", () => {
  it("should be able to reset password", async () => {
    const user = await fixtures.user.create({ shouldVerify: false });
    const { caller } = await fixtures.mockCurrentUser({ user: null });

    // forgot
    await caller.user.forgotPassword({ email: user?.email as string });

    // get the resetToken
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        provider_providerAccountId: {
          provider: AUTH_PROVIDERS.credentials,
          providerAccountId: user?.id as string,
        },
      },
    });

    const input = {
      email: user?.email as string,
      resetToken: account.resetToken as string,
      newPassword: faker.random.alphaNumeric(12),
    };

    const response = await caller.user.resetPassword(input);
    expect(response).toEqual(true);

    const updatedAccount = await prisma.account.findUniqueOrThrow({
      where: { id: account.id },
    });
    expect(updatedAccount.resetToken).toBeNull();
    expect(updatedAccount.resetTokenExpiresAt).toBeNull();
    expect(updatedAccount.hashedPassword).toBeDefined();
    expect(updatedAccount.hashedPassword).not.toEqual(account.hashedPassword);
    expect(updatedAccount.salt).toBeDefined();
    expect(updatedAccount.salt).not.toEqual(account.salt);
  });

  it("should show errors", async () => {
    const user = await fixtures.user.create({ shouldVerify: false });
    const { caller } = await fixtures.mockCurrentUser({ user: null });

    // forgot with expired token
    const account = await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider: AUTH_PROVIDERS.credentials,
          providerAccountId: user?.id as string,
        },
      },
      data: {
        resetToken: randomCuid(),
        resetTokenExpiresAt: dayjs().add(-1, "minute").toDate(),
      },
    });

    const cases = [
      {
        input: {
          email: user?.email as string,
          resetToken: account.resetToken as string,
          newPassword: faker.random.alphaNumeric(12),
        },
        err: "Expired",
      },
      {
        input: {
          email: faker.internet.email(),
          resetToken: randomCuid(),
          newPassword: faker.random.alphaNumeric(12),
        },
        err: "notFound",
      },
      {
        input: {
          email: user?.email as string,
          resetToken: randomCuid(),
          newPassword: faker.random.alphaNumeric(12),
        },
        err: "Mismatch",
      },
      {
        input: {
          email: user?.email as string,
          resetToken: account.resetToken as string,
          newPassword: faker.random.alphaNumeric(5),
        },
        err: "too_small",
      },
    ];

    for (const c of cases) {
      await expect(caller.user.resetPassword(c.input)).rejects.toThrowError(
        c.err,
      );
    }
  });
});
