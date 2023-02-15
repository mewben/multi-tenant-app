import { getDomainUrl, type CurrentUser } from "@acme/shared";
import type { IncomingHttpHeaders } from "http";
import { isUndefined } from "lodash";
import type { Session } from "next-auth";

import { appRouter } from "~/api/root";
import { createInnerTRPCContext } from "~/api/trpc";
import { user as userFixture } from "./user";

export const createSession = async (
  userInput?: Partial<CurrentUser> | null,
): Promise<Session | null> => {
  const user = isUndefined(userInput) ? await userFixture.create() : userInput;

  return {
    user,
    expires: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
  } as Session;
};

const createHeaders = (domain?: string): IncomingHttpHeaders => {
  return {
    host: getDomainUrl({ domain, includeProtocol: false }),
  };
};

// -------------
// pass nothing for non-login
interface MockCurrentUserProps {
  user?: Partial<CurrentUser> | null;
  domain?: string;
}
export const mockCurrentUser = async ({
  user: userInput,
  domain,
}: MockCurrentUserProps = {}) => {
  const currentDomain = userInput?.profile?.workspace.domain;
  const session = (await createSession(userInput)) as Session;

  const ctx = createInnerTRPCContext({
    session,
    headers: createHeaders(domain ?? currentDomain),
  });

  const caller = appRouter.createCaller(ctx);
  return { caller, ctx, user: session.user };
};
