import { faker } from "@faker-js/faker";
import { pick } from "lodash";
import { PROFILE_STATUS } from "@acme/db";

import fixtures from "~/api/fixtures";
import { createProfile } from "./create-profile";

describe("profile.model.create", () => {
  it("should create a new profile", async () => {
    const user = await fixtures.user.create({ shouldOnboard: false });
    const { ctx } = await fixtures.mockCurrentUser({ user });
    const { workspace: workspace1 } = await fixtures.workspace.create({
      ctx,
      shouldCreateProfile: false,
    });

    const role1 = await fixtures.role.create({
      input: { workspaceId: workspace1.id },
      ctx,
      insertOpts: { skipBase: true },
    });

    const input = {
      firstName: faker.name.firstName(),
      roleId: role1.id,
      userId: user?.id,
      workspaceId: workspace1.id,
    };

    const response = await createProfile({
      input,
      ctx,
      insertOpts: { skipBase: true },
    });
    expect(
      pick(response, [
        "firstName",
        "workspaceId",
        "userId",
        "roleId",
        "status",
        "createdBy",
        "updatedBy",
      ]),
    ).toEqual({
      workspaceId: workspace1.id,
      userId: user?.id,
      roleId: role1.id,
      status: PROFILE_STATUS.active,
      firstName: input.firstName,
      createdBy: response.id,
      updatedBy: response.id,
    });
  });

  it.skip("should validate input", async () => {
    // TODO:
  });
});
