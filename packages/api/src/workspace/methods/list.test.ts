import fixtures from "~/api/fixtures";

describe("workspace.list", () => {
  it("should return the list of profiles with workspaces", async () => {
    const { caller, ctx } = await fixtures.mockCurrentUser();
    // create more workspaces for this user
    await fixtures.workspace.create({ ctx });
    await fixtures.workspace.create({ ctx });
    await fixtures.workspace.create({ ctx });

    // create workspace for another user
    const { caller: caller2, ctx: ctx2 } = await fixtures.mockCurrentUser();
    await fixtures.workspace.create({ ctx: ctx2 });

    const response1 = await caller.workspace.list();
    expect(response1.length).toEqual(4);

    const response2 = await caller2.workspace.list();
    expect(response2.length).toEqual(2);
  });
});
