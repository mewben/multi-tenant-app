import { randomId } from "@acme/shared";

import fixtures from "~/api/fixtures";

describe("profile.getById", () => {
  it("should get a profile by id", async () => {
    const user = await fixtures.user.create({});

    const { caller, ctx } = await fixtures.mockCurrentUser({
      user,
      domain: user?.profile?.workspace.domain,
    });

    // create 1 dummy profile
    const profile2 = await fixtures.profile.create({ ctx });

    const res1 = await caller.profile.getById({
      id: user?.profile?.id as string,
    });
    expect(res1?.firstName).toEqual(user?.profile?.firstName);
    expect(res1?.workspaceId).toEqual(user?.profile?.workspace.id);
    expect(res1?.user?.email).toEqual(user?.email);
    expect(res1?.user?.accounts.length).toEqual(1);

    const res2 = await caller.profile.getById({
      id: profile2.id,
    });
    expect(res2?.user?.accounts.length).toEqual(0);
  });

  it("should return null for not found profile", async () => {
    const user = await fixtures.user.create({});

    const { caller } = await fixtures.mockCurrentUser({
      user,
      domain: user?.profile?.workspace.domain,
    });

    const res1 = await caller.profile.getById({
      id: randomId(),
    });
    expect(res1).toBeNull();
  });

  it("should return null for profile not inside the current workspace", async () => {
    const user1 = await fixtures.user.create({});
    const user2 = await fixtures.user.create({});

    const workspace1 = user1?.profile?.workspace;
    const workspace2 = user2?.profile?.workspace;

    const { ctx } = await fixtures.mockCurrentUser({
      user: user1,
      domain: workspace1?.domain,
    });

    const profile1 = await fixtures.profile.create({ ctx });

    const { caller: caller2 } = await fixtures.mockCurrentUser({
      user: user2,
      domain: workspace2?.domain,
    });

    const res1 = await caller2.profile.getById({ id: profile1.id });
    expect(res1).toBeNull();
  });
});
