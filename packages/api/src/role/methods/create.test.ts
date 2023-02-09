import { faker } from "@faker-js/faker";
import { pick } from "lodash";

import fixtures from "~/api/fixtures";
import { create as createMethod } from "./create";
import "jest-date-2";

describe("role.create", () => {
  it("should create a new role [createMethod]", async () => {
    const { ctx } = fixtures.mockCurrentUser();
    const workspace1 = await fixtures.workspace.create({ ctx });

    const input = {
      title: faker.random.word(),
      isAdmin: true,
      workspaceId: workspace1.id,
    };

    const response = await createMethod({
      input,
      ctx,
      insertOpts: { skipBase: true },
    });
    expect(
      pick(response, [
        "title",
        "isAdmin",
        "workspaceId",
        "createdBy",
        "updatedBy",
      ]),
    ).toEqual({
      title: input.title,
      isAdmin: true,
      workspaceId: workspace1.id,
      // should be null if no profile in context
      createdBy: null,
      updatedBy: null,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(response.createdAt).toBeWithinMinuteAs(new Date());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(response.updatedAt).toBeWithinMinuteAs(new Date());
  });
});
