import { faker } from "@faker-js/faker";

import "jest-date-2";
import slug from "slug";
import { prisma } from "@acme/db";

import fixtures from "~/api/fixtures";
import { createWorkspace } from "./create-workspace";

describe("workspace.model.create", () => {
  it("should create a new workspace", async () => {
    const { ctx } = await fixtures.mockCurrentUser();

    const input = {
      title: faker.random.word(),
      domain: faker.random.alphaNumeric(12),
    };

    const { workspace } = await createWorkspace({ input, ctx });

    expect(workspace.title).toEqual(input.title);
    expect(workspace.domain).toEqual(slug(input.domain));
    expect(workspace.createdAt).toBeWithinMinuteAs(new Date());

    // should create a default role for this workspace
    const roles = await prisma.role.findMany({
      where: { workspaceId: workspace.id },
    });
    expect(roles.length).toEqual(1);
    expect(roles?.[0]?.isAdmin).toEqual(true);
  });

  it("should validate input", async () => {
    const { ctx } = await fixtures.mockCurrentUser();
    const { workspace: workspace1 } = await createWorkspace({
      input: {
        title: faker.random.word(),
        domain: faker.random.alphaNumeric(8),
      },
      ctx,
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
        err: "tn.error:title.required",
      },
      {
        input: { title: "something", domain: "" },
        err: "tn.error:domain.required",
      },
      {
        input: {
          title: "a",
          domain: faker.random.word(),
        },
        err: "tn.error:title.too_small",
      },
      {
        input: {
          title: faker.random.word(),
          domain: "a",
        },
        err: "tn.error:domain.too_small",
      },
    ];

    for (const c of cases) {
      await expect(
        createWorkspace({ input: c.input, ctx }),
      ).rejects.toThrowError(c.err);
    }
  });
});
