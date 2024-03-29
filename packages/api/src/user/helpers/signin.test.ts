import { faker } from "@faker-js/faker";
import { getDomainUrl } from "@acme/shared";

import fixtures from "~/api/fixtures";
import { signin } from "./signin";
import { signup } from "./signup";

describe("auth.signin [credentials]", () => {
  it("should successfully signin", async () => {
    // signup first
    const signupInput = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(12),
    };
    await signup({ input: signupInput });

    // execute login
    const response = await signin({
      input: { email: signupInput.email, password: signupInput.password },
      headers: { host: getDomainUrl({ includeProtocol: false }) },
    });
    expect(response.id).toBeDefined();
  });

  it("should validate input", async () => {
    const signupInput = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(12),
    };
    await signup({ input: signupInput });

    const headers = {
      host: getDomainUrl({ includeProtocol: false }),
    };

    const cases = [
      {
        input: { email: "", password: "" },
        err: `tn.error:email.required`,
      },
      {
        input: { email: "something", password: "123456" },
        err: `tn.error:email.invalid_string`,
      },
      {
        input: { email: faker.internet.email(), password: "" },
        err: `tn.error:password.required`,
      },
      {
        input: { email: faker.internet.email(), password: "12" },
        err: `tn.error:password.too_small`,
      },
      {
        input: { email: faker.internet.email(), password: "123456" },
        err: `tn.error:auth.invalidCredentials`,
      },
      {
        input: { email: signupInput.email, password: "123456" },
        err: `tn.error:auth.invalidCredentials`,
      },
    ];

    for (const c of cases) {
      await expect(signin({ input: c.input, headers })).rejects.toThrowError(
        c.err,
      );
    }
  });

  it("should not login if it doesnt belong to the current workspace", async () => {
    const user1 = await fixtures.user.create({ input: { password: "111111" } });
    const user2 = await fixtures.user.create({});

    const workspace2 = user2?.profile?.workspace;

    await expect(
      signin({
        input: { email: user1?.email as string, password: "111111" },
        headers: {
          host: getDomainUrl({
            domain: workspace2?.domain,
            includeProtocol: false,
          }),
        },
      }),
    ).rejects.toThrowError("tn.error:workspace.notFound");
  });

  // we use protectedProcedure for active profile
  // authedProcedure if active profile is not required
  it("should still login if profile is not active", async () => {
    const user1 = await fixtures.user.create({});
    const user2 = await fixtures.user.create({ input: { password: "111111" } });

    const { ctx } = await fixtures.mockCurrentUser({ user: user1 });

    // invite user2 to workspace1
    await fixtures.profile.create({
      input: { email: user2?.email as string, willInvite: true },
      ctx,
    });

    // try signing in user2 to workspace1 without accept invite
    const response = await signin({
      input: { email: user2?.email as string, password: "111111" },
      headers: {
        host: getDomainUrl({
          domain: user1?.profile?.workspace?.domain,
          includeProtocol: false,
        }),
      },
    });
    expect(response.id).toBeDefined();
  });
});
