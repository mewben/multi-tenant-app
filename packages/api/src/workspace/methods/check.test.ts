import { faker } from "@faker-js/faker";

import fixtures from "~/api/fixtures";

describe("workspace.check", () => {
  it("should check the workspace domain", async () => {
    const { ctx, user } = await fixtures.mockCurrentUser();
    const { workspace: workspace1 } = await fixtures.workspace.create({
      ctx,
      shouldCreateProfile: false,
    });

    const { caller } = await fixtures.mockCurrentUser({
      user,
      domain: workspace1.domain,
    });

    const response = await caller.workspace.check();
    expect(response).toEqual(true);

    const { caller: caller2 } = await fixtures.mockCurrentUser({
      user,
      domain: faker.random.alphaNumeric(12),
    });

    const response2 = await caller2.workspace.check();
    expect(response2).toEqual(false);
  });
});
