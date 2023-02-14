import { randomId } from "@acme/shared";

import fixtures from "~/api/fixtures";

describe("profile.remove", () => {
  it("should remove a profile", async () => {
    const { caller, ctx } = await fixtures.mockCurrentUser();

    const profile2 = await fixtures.profile.create({ ctx });

    const response = await caller.profile.remove([profile2?.id]);
    expect(response?.removedIds).toEqual([profile2?.id]);
    expect(response?.warning).toBeUndefined();
  });

  it("should remove multiple profiles", async () => {
    const { caller, ctx } = await fixtures.mockCurrentUser();

    const profile2 = await fixtures.profile.create({ ctx });
    const profile3 = await fixtures.profile.create({ ctx });

    const ids = [profile2?.id, profile3?.id];
    const response = await caller.profile.remove(ids);
    expect(response?.removedIds).toEqual(ids);
    expect(response?.warning).toBeUndefined();
  });

  it("should not remove a profile from another workspace", async () => {
    const { ctx } = await fixtures.mockCurrentUser();

    const profile2 = await fixtures.profile.create({ ctx });

    const { caller: caller2 } = await fixtures.mockCurrentUser();

    await expect(caller2.profile.remove([profile2.id])).rejects.toThrowError(
      "tn.error:remove.failed",
    );
  });

  it("should not remove your own profile", async () => {
    const { caller, user: admin } = await fixtures.mockCurrentUser();

    await expect(
      caller.profile.remove([admin?.profile?.id as string]),
    ).rejects.toThrowError("tn.error:profile.cannotRemoveOwn");
  });

  it("should return the successfully removedIds", async () => {
    const { caller, ctx } = await fixtures.mockCurrentUser();

    const profile2 = await fixtures.profile.create({ ctx });
    const profile3 = await fixtures.profile.create({ ctx });

    const ids = [profile2?.id, profile3?.id];
    const response = await caller.profile.remove([
      randomId(),
      ...ids,
      randomId(),
    ]);
    expect(response?.removedIds).toEqual(ids);
    expect(response?.warning).toEqual("tn.warning:remove.notAll");
  });

  it.skip("should not be able to remove admin profiles if you are not the admin", async () => {
    // TODO
  });
});
