import { faker } from "@faker-js/faker";
import { pick } from "lodash";

import fixtures from "~/api/fixtures";
// calling methods directly means that the input has been validated
import { createUser } from "./create-user";

describe("user.model.create", () => {
  it("should create a user", async () => {
    const { ctx } = await fixtures.mockCurrentUser();
    const input = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      image: faker.random.alphaNumeric(8),
    };

    const user = await createUser({ input, ctx });

    expect(user.id).not.toBeNull();
    expect(user.createdAt).not.toBeNull();
    expect(user.updatedAt).not.toBeNull();
    expect(pick(user, "name", "email", "emailVerified", "image")).toEqual({
      ...input,
      emailVerified: null,
    });
  });

  it("should throw duplicate email", async () => {
    const { ctx } = await fixtures.mockCurrentUser();
    const email = faker.internet.email();
    await createUser({ input: { email }, ctx });

    await expect(createUser({ input: { email }, ctx })).rejects.toThrowError(
      `tn.error:email.duplicate`,
    );
  });
});
