import { PROFILE_STATUS } from "@acme/db";
import { getDomainUrl } from "@acme/shared";

import fixtures from "~/api/fixtures";
import { getCurrentUser } from "~/api/user/helpers/get-current-user";

describe("profile.acceptInvitation", () => {
  it("should be able to accept invitation", async () => {
    // prepare
    const user1 = await fixtures.user.create({});
    let user2 = await fixtures.user.create({});

    const { ctx } = await fixtures.mockCurrentUser({
      user: user1,
    });

    // invite user2
    const profile2 = await fixtures.profile.create({
      ctx,
      input: { email: user2?.email as string, willInvite: true },
    });

    user2 = await getCurrentUser({
      userId: user2?.id,
      ctx: {
        ...ctx,
        headers: {
          host: getDomainUrl({
            domain: user1?.profile?.workspace.domain,
            includeProtocol: false,
          }),
        },
      },
    });

    const { caller: caller2 } = await fixtures.mockCurrentUser({
      user: user2,
      domain: user1?.profile?.workspace.domain,
    });

    // execute
    const response = await caller2.profile.acceptInvitation({
      invitationCode: profile2.invitationCode as string,
    });

    // assert
    expect(response.invitationCode).toBeNull();
    expect(response.status).toEqual(PROFILE_STATUS.active);
  });
});
