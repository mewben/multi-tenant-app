import type { IncomingHttpHeaders } from "http";
import { faker } from "@faker-js/faker";
import type { Session } from "next-auth";
import { getDomainUrl, randomId, type CurrentUser } from "@acme/shared";

import { appRouter } from "~/api/root";
import { createInnerTRPCContext } from "~/api/trpc";

export const createSession = (user?: Partial<CurrentUser>): Session | null => {
  if (!user) return null;

  return {
    user: {
      id: randomId(),
      name: faker.name.firstName(),
      email: faker.internet.email(),
      emailVerified: new Date(),
      image: "",
      currentProfile: undefined,
      otherProfiles: [],
      ...user,
    },
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
  user?: Partial<CurrentUser>;
  domain?: string;
}
export const mockCurrentUser = ({
  user,
  domain,
}: MockCurrentUserProps = {}) => {
  const currentDomain = user?.profile?.workspace.domain;
  const ctx = createInnerTRPCContext({
    session: createSession(user),
    headers: createHeaders(currentDomain ?? domain),
  });
  const caller = appRouter.createCaller(ctx);
  return { caller, ctx };
};
