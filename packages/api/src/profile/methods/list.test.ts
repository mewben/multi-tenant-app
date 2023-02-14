import fixtures from "~/api/fixtures";

describe("profile.list", () => {
  it("should only list within the workspace", async () => {
    const user1 = await fixtures.user.create({});
    const user2 = await fixtures.user.create({});

    const workspace1 = user1?.profile?.workspace;
    const workspace2 = user2?.profile?.workspace;

    const { caller, ctx } = await fixtures.mockCurrentUser({
      user: user1,
      domain: workspace1?.domain,
    });

    // create 2 more dummy profiles for w1
    await fixtures.profile.create({ ctx });
    await fixtures.profile.create({ ctx });

    const { caller: caller2 } = await fixtures.mockCurrentUser({
      user: user2,
      domain: workspace2?.domain,
    });

    const response1 = await caller.profile.list();
    expect(response1.length).toEqual(3);

    const response2 = await caller2.profile.list();
    expect(response2.length).toEqual(1);
  });
});
