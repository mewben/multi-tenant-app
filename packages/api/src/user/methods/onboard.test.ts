import { faker } from "@faker-js/faker";
import { PROFILE_STATUS } from "@prisma/client";
import { pick } from "lodash";
import slug from "slug";
import { getCurrentUser } from "@acme/auth";
import { prisma } from "@acme/db";
import { getDomainUrl } from "@acme/shared";

import fixtures from "~/api/fixtures";

// we should onboard a user if
// - no currentProfile or
// - no otherProfiles
describe("user.onboard", () => {
  it("should onboard a verified user", async () => {
    let user = await fixtures.user.create({ shouldOnboard: false });
    const { caller, ctx } = fixtures.mockCurrentUser({ user });

    const onboardingInput = {
      firstName: faker.name.firstName(),
      workspaceTitle: faker.random.words(2),
      workspaceDomain: faker.random.alphaNumeric(8),
    };

    const domain = slug(onboardingInput.workspaceDomain);

    const response = await caller.user.onboard(onboardingInput);
    expect(response.domain).toEqual(domain);

    // assert user
    user = await getCurrentUser({
      userId: user?.id as string,
      ctx: {
        ...ctx,
        headers: { host: getDomainUrl({ domain, includeProtocol: false }) },
      },
    });
    expect(user?.profile?.workspace?.id).toBeDefined();
    expect(user?.profile?.workspace?.title).toEqual(
      onboardingInput.workspaceTitle,
    );
    expect(user?.profile?.workspace?.domain).toEqual(domain);

    // assert created Profile
    const profile = await prisma.profile.findUnique({
      where: { id: user?.profile?.id },
    });
    expect(pick(profile, "firstName", "status")).toMatchObject({
      firstName: onboardingInput.firstName,
      status: PROFILE_STATUS.active,
    });
  });

  it("should not onboard a non-verified user", async () => {
    const user = await fixtures.user.create({ shouldVerify: false });
    const { caller } = fixtures.mockCurrentUser({ user });

    const onboardingInput = {
      firstName: faker.name.firstName(),
      workspaceTitle: faker.random.words(2),
      workspaceDomain: faker.random.alphaNumeric(8),
    };
    await expect(caller.user.onboard(onboardingInput)).rejects.toThrowError(
      "UNAUTHORIZED",
    );
  });

  it.skip("should not onboard already onboarded user", async () => {
    // TODO
  });

  it.skip("should validate input", async () => {
    // TODO
  });
});
