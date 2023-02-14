import { faker } from "@faker-js/faker";
import {
  throwError,
  type CreateUserProfileInput,
  type WithContext,
} from "@acme/shared";

import { create as createUserProfile } from "~/api/profile/methods";
import fixtures from ".";

interface CreateProfileProps extends WithContext {
  input?: Partial<CreateUserProfileInput>;
}

export const profile = {
  create: async ({ input, ctx }: CreateProfileProps) => {
    let roleId = input?.roleId || "";
    if (!input?.roleId) {
      // create new role
      const role = await fixtures.role.create({ ctx });
      if (!role) return throwError("no role");
      roleId = role.id;
    }

    return await createUserProfile({
      input: {
        firstName: faker.name.firstName(),
        email: faker.internet.email(),
        roleId,
        willInvite: false,
        ...input,
      },
      ctx,
    });
  },
};
