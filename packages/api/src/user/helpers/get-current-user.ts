import { omit } from "lodash";
import { CurrentUser, getSubdomain, type WithContext } from "@acme/shared";

interface Props extends WithContext {
  userId?: string;
}

// TODO: as this will be hit many times, implement caching for this
export const getCurrentUser = async ({
  userId,
  ctx,
}: Props): Promise<CurrentUser | undefined> => {
  if (!userId) return;

  const currentDomain = getSubdomain(ctx.headers.host);

  const user = await ctx.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      profiles: {
        where: {
          workspace: {
            domain: currentDomain,
          },
        },
        select: {
          id: true,
          firstName: true,
          workspace: {
            select: {
              id: true,
              domain: true,
              title: true,
            },
          },
          role: {
            select: {
              id: true,
              title: true,
              isAdmin: true,
            },
          },
        },
      },
    },
  });

  if (!user) return;

  const response: CurrentUser = omit(user, "profiles");

  if (user.profiles.length) {
    response.profile = user.profiles[0];
  }

  return response;
};
