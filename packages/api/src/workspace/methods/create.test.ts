import { faker } from "@faker-js/faker";

import "jest-date-2";
import { prisma } from "@acme/db";

import fixtures from "~/api/fixtures";

describe("workspace.create", () => {
  it("should create a new workspace", async () => {
    const { caller } = await fixtures.mockCurrentUser();

    const input = {
      title: faker.random.word(),
      domain: "Test 1",
    };

    const response = await caller.workspace.create(input);

    expect(response.title).toEqual(input.title);
    expect(response.domain).toEqual("test-1");
    expect(response.createdAt).toBeWithinMinuteAs(new Date());

    // should create a default role for this workspace
    const roles = await prisma.role.findMany({
      where: { workspaceId: response.id },
    });
    expect(roles.length).toEqual(1);
    expect(roles?.[0]?.isAdmin).toEqual(true);
  });

  it("should validate input", async () => {
    const { caller, ctx } = await fixtures.mockCurrentUser();
    const { workspace: workspace1 } = await fixtures.workspace.create({
      ctx,
      shouldCreateProfile: false,
    });

    const cases = [
      {
        input: {
          title: faker.random.word(),
          domain: workspace1.domain,
        },
        err: "tn.error:workspace.duplicate",
      },
      {
        input: { title: "", domain: "" },
        err: "too_small",
      },
      {
        input: {
          title: "a",
          domain: faker.random.word(),
        },
        err: "too_small",
      },
      {
        input: {
          title: faker.random.word(),
          domain: "a",
        },
        err: "too_small",
      },
    ];

    for (const c of cases) {
      await expect(caller.workspace.create(c.input)).rejects.toThrowError(
        c.err,
      );
    }
  });
});
