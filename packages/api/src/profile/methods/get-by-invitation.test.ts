import fixtures from "~/api/fixtures";

describe("profile.getByInvitation", () => {
  it("should get a profile by invitationCode", async () => {
    const user1 = await fixtures.user.create({});
    const user2 = await fixtures.user.create({});

    const workspace1 = user1?.profile?.workspace;
    const workspace2 = user2?.profile?.workspace;

    const { caller, ctx } = await fixtures.mockCurrentUser({
      user: user1,
      domain: workspace1?.domain,
    });

    const profile1 = await fixtures.profile.create({
      ctx,
      input: { willInvite: true },
    });

    const { ctx: ctx2 } = await fixtures.mockCurrentUser({
      user: user2,
      domain: workspace2?.domain,
    });

    const profile2 = await fixtures.profile.create({
      ctx: ctx2,
      input: { willInvite: true },
    });

    const response1 = await caller.profile.getByInvitation({
      id: profile1.id,
      invitationCode: profile1.invitationCode as string,
    });
    expect(response1).toBeDefined();

    const response2 = await caller.profile.getByInvitation({
      id: profile2.id,
      invitationCode: profile2.invitationCode as string,
    });
    expect(response2).toBeNull();
  });
});
