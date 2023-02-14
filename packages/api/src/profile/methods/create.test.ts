import { faker } from "@faker-js/faker";
import { PROFILE_STATUS } from "@prisma/client";
import { pick } from "lodash";
import { prisma } from "@acme/db";

import fixtures from "~/api/fixtures";

describe("profile.create", () => {
  it("should set pending if willInvite", async () => {
    // user admin as current user
    const { caller, user: admin } = await fixtures.mockCurrentUser();

    const currentProfile = admin?.profile;
    const roleId = currentProfile?.role.id as string;

    // create user profile with invitation
    const input = {
      firstName: faker.name.firstName(),
      roleId,
      email: faker.internet.email(),
      image: faker.random.alphaNumeric(12),
      willInvite: true,
    };

    const response = await caller.profile.create(input);
    expect(response?.id).toBeDefined();
    expect(response?.userId).toBeDefined();
    expect(response?.invitationCode).toBeDefined();
    expect(
      pick(
        response,
        "firstName",
        "roleId",
        "status",
        "invitedBy",
        "createdBy",
        "updatedBy",
        "workspaceId",
      ),
    ).toMatchObject({
      firstName: input.firstName,
      roleId,
      status: PROFILE_STATUS.pending,
      invitedBy: currentProfile?.id,
      createdBy: currentProfile?.id,
      updatedBy: currentProfile?.id,
      workspaceId: currentProfile?.workspace.id,
    });

    // assert created user
    const user = await prisma.user.findUnique({
      where: { id: response?.userId as string },
    });
    expect(pick(user, "name", "email", "image")).toMatchObject({
      name: input.firstName,
      email: input.email,
      image: input.image,
    });

    // assert no created account
    const account = await prisma.account.findFirst({
      where: {
        userId: user?.id,
      },
    });
    expect(account).toBeNull();

    // TODO: assert sent email invitation
  });

  it("should set to inactive by default if willInvite=false", async () => {
    // user admin as current user
    const { caller, user: admin } = await fixtures.mockCurrentUser();

    const currentProfile = admin?.profile;
    const roleId = currentProfile?.role.id as string;

    // create user profile with invitation
    const input = {
      firstName: faker.name.firstName(),
      roleId,
      email: faker.internet.email(),
      image: faker.random.alphaNumeric(12),
      willInvite: false,
    };

    const response = await caller.profile.create(input);
    expect(response?.id).toBeDefined();
    expect(response?.userId).toBeDefined();
    expect(response.invitationCode).toBeNull();
    expect(
      pick(
        response,
        "firstName",
        "roleId",
        "status",
        "invitedBy",
        "createdBy",
        "updatedBy",
        "workspaceId",
      ),
    ).toMatchObject({
      firstName: input.firstName,
      roleId,
      status: PROFILE_STATUS.inactive,
      invitedBy: currentProfile?.id,
      createdBy: currentProfile?.id,
      updatedBy: currentProfile?.id,
      workspaceId: currentProfile?.workspace.id,
    });

    // assert created user
    const user = await prisma.user.findUnique({
      where: { id: response?.userId as string },
    });
    expect(pick(user, "name", "email", "image")).toMatchObject({
      name: input.firstName,
      email: input.email,
      image: input.image,
    });

    // assert no created account
    const account = await prisma.account.findFirst({
      where: {
        userId: user?.id,
      },
    });
    expect(account).toBeNull();
  });

  it("should use be able to create profile with existing user record", async () => {
    // user admin as current user
    const admin = await fixtures.user.create();
    const admin2 = await fixtures.user.create();
    const { caller } = await fixtures.mockCurrentUser({ user: admin });

    const currentProfile = admin?.profile;
    const roleId = currentProfile?.role.id as string;

    // create user profile with invitation
    const input = {
      firstName: faker.name.firstName(),
      roleId,
      email: admin2?.email as string,
      image: faker.random.alphaNumeric(12),
      willInvite: true,
    };

    const response = await caller.profile.create(input);
    expect(response?.id).toBeDefined();
    expect(response?.userId).toBeDefined();
    expect(response.invitationCode).toBeDefined();
    expect(
      pick(
        response,
        "firstName",
        "roleId",
        "status",
        "invitedBy",
        "createdBy",
        "updatedBy",
        "workspaceId",
      ),
    ).toMatchObject({
      firstName: input.firstName,
      roleId,
      status: PROFILE_STATUS.pending,
      invitedBy: currentProfile?.id,
      createdBy: currentProfile?.id,
      updatedBy: currentProfile?.id,
      workspaceId: currentProfile?.workspace.id,
    });

    // assert created user
    const user = await prisma.user.findUnique({
      where: { id: response?.userId as string },
    });
    expect(pick(user, "name", "email", "image")).toMatchObject({
      name: admin2?.name,
      email: admin2?.email,
      image: admin2?.image,
    });

    // assert no created account
    const account = await prisma.account.findFirst({
      where: {
        userId: user?.id,
      },
    });
    expect(account?.id).toBeDefined();
  });
});
