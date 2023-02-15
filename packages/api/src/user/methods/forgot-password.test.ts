import { AUTH_PROVIDERS, prisma } from "@acme/db";
import { faker } from "@faker-js/faker";
import fixtures from "~/api/fixtures";

describe("user.forgotPassword", () => {
  it("should send a reset password link", async () => {
    // signup user
    const user = await fixtures.user.create({ shouldVerify: false });
    const { caller } = await fixtures.mockCurrentUser({ user: null });

    // forgot password
    const response = await caller.user.forgotPassword({
      email: user?.email as string,
    });
    expect(response).toEqual(true);

    // assert account.resetToken
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        provider_providerAccountId: {
          provider: AUTH_PROVIDERS.credentials,
          providerAccountId: user?.id as string,
        },
      },
    });
    expect(account.resetToken).toBeDefined();
    expect(account.resetTokenExpiresAt).toBeDefined();

    // TODO: assert email sent
  });

  it("should throw error if email not found", async () => {
    const { caller } = await fixtures.mockCurrentUser({ user: null });

    // forgot password
    await expect(
      caller.user.forgotPassword({
        email: faker.internet.email(),
      }),
    ).rejects.toThrowError("notFound");
  });

  it.skip("should validate input", async () => {
    // TODO
  });
});
