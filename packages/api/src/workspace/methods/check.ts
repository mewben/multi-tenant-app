import { getSubdomain, type WithContext } from "@acme/shared";

export const check = async ({ ctx }: WithContext) => {
  const domain = getSubdomain(ctx.headers.host);
  if (domain === process.env.NEXT_PUBLIC_APP_SUBDOMAIN) {
    return { domain };
  }

  return await ctx.prisma.workspace.findUnique({
    where: { domain },
    select: { domain: true },
  });
};
