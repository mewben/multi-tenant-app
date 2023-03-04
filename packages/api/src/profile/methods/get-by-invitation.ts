import {
  getSubdomain,
  type GetProfileByInvitationInput,
  type WithContext,
} from "@acme/shared";

interface Props extends WithContext {
  input: GetProfileByInvitationInput;
}

// this is a public procedure
// get profile via id and invitationCode and subdomain
export const getByInvitation = async ({ input, ctx }: Props) => {
  const currentDomain = getSubdomain(ctx.headers.host);

  const profile = await ctx.prisma.profile.findUnique({
    where: { id: input.id },
    select: {
      id: true,
      invitationCode: true,
      workspace: {
        select: {
          domain: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!profile) return null;

  if (profile.workspace.domain !== currentDomain) return null;

  return profile;
};
