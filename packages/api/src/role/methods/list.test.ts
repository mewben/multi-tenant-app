import fixtures from "~/api/fixtures";

describe("role.list", () => {
  it("should only list within the workspace", async () => {
    const user1 = await fixtures.user.create({});
    const user2 = await fixtures.user.create({});

    const workspace1 = user1?.profile?.workspace;
    const workspace2 = user2?.profile?.workspace;

    const { caller, ctx } = fixtures.mockCurrentUser({
      user: user1,
      domain: workspace1?.domain,
    });

    // create 2 more dummy roles for w1
    await fixtures.role.create({ ctx });
    await fixtures.role.create({ ctx });

    const { caller: caller2 } = fixtures.mockCurrentUser({
      user: user2,
      domain: workspace2?.domain,
    });

    const response1 = await caller.role.list();
    expect(response1.length).toEqual(3);

    const response2 = await caller2.role.list();
    expect(response2.length).toEqual(1);
  });
});
