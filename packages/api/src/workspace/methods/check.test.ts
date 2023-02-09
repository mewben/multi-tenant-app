import { faker } from "@faker-js/faker";

import fixtures from "~/api/fixtures";

describe("workspace.check", () => {
  it("should check the workspace domain", async () => {
    const { ctx } = fixtures.mockCurrentUser({ user: {} });
    const workspace1 = await fixtures.workspace.create({ ctx });

    const { caller } = fixtures.mockCurrentUser({ domain: workspace1.domain });

    const response = await caller.workspace.check();
    expect(response).toEqual({ domain: workspace1.domain });

    const { caller: caller2 } = fixtures.mockCurrentUser({
      domain: faker.random.alphaNumeric(12),
    });

    const response2 = await caller2.workspace.check();
    expect(response2).toBeNull();
  });
});
