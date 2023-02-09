import { faker } from "@faker-js/faker";
import type { CreateWorkspaceInput, WithContext } from "@acme/shared";

import { create as createWorkspace } from "~/api/workspace/methods";

interface CreateWorkspaceProps extends WithContext {
  input?: CreateWorkspaceInput;
}

export const workspace = {
  create: async ({ input, ctx }: CreateWorkspaceProps) => {
    return await createWorkspace({
      input: {
        title: faker.random.words(2),
        domain: faker.random.alphaNumeric(8),
        ...input,
      },
      ctx,
    });
  },
};
