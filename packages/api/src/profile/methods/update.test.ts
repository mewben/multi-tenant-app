import { faker } from "@faker-js/faker";
import { prisma } from "@acme/db";

import fixtures from "~/api/fixtures";

describe("profile.update", () => {
  it("should update profile", async () => {
    const user = await fixtures.user.create({});

    const { caller } = await fixtures.mockCurrentUser({
      user,
      domain: user?.profile?.workspace.domain,
    });

    const oldProfile = await prisma.profile.findUnique({
      where: { id: user?.profile?.id as string },
    });

    const input = {
      id: user?.profile?.id as string,
      firstName: faker.name.firstName(),
      image: faker.random.alphaNumeric(12),
    };

    const response = await caller.profile.update(input);
    expect(response.firstName).toEqual(input.firstName);
    expect(response.image).toEqual(input.image);
    expect(response.updatedAt).not.toEqual(oldProfile?.updatedAt);
    expect(response.updatedBy).toEqual(user?.profile?.id);
  });

  it.skip("should validate input", async () => {
    // TODO
  });
});
