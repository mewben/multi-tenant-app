import { faker } from "@faker-js/faker";
import { pick } from "lodash";

import fixtures from "~/api/fixtures";
// calling methods directly means that the input has been validated
import { findOrCreateUser } from "./find-or-create-user";

describe("user.model.create", () => {
  it("should create a user", async () => {
    const { ctx } = await fixtures.mockCurrentUser();
    const input = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      image: faker.random.alphaNumeric(8),
    };

    const user = await findOrCreateUser({ input, ctx });

    expect(user.id).not.toBeNull();
    expect(user.createdAt).not.toBeNull();
    expect(user.updatedAt).not.toBeNull();
    expect(pick(user, "name", "email", "emailVerified", "image")).toEqual({
      ...input,
      emailVerified: null,
    });
  });

  it("should return the record if found", async () => {
    const { ctx } = await fixtures.mockCurrentUser();
    const email = faker.internet.email();
    const user = await findOrCreateUser({ input: { email }, ctx });

    expect(user.id).not.toBeNull();
    expect(user.createdAt).not.toBeNull();
    expect(user.updatedAt).not.toBeNull();
    expect(user.email).toEqual(email);
  });
});
