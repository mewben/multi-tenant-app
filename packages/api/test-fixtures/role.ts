import { faker } from "@faker-js/faker";
import type { WithContext } from "@acme/shared";

import { create as createRole } from "~/api/role/methods";
import type { CreateRoleInputProps } from "~/api/role/methods/create";

interface CreateRoleProps extends WithContext {
  input?: Partial<CreateRoleInputProps>;
  insertOpts?: Record<string, any>;
}

export const role = {
  create: async ({ input, ctx, insertOpts }: CreateRoleProps) => {
    return await createRole({
      input: {
        title: faker.random.alphaNumeric(8),
        isAdmin: true,
        ...input,
      },
      ctx,
      insertOpts,
    });
  },
};
