import { getSubdomain, type WithContext } from "@acme/shared";

import { WorkspaceModel } from "../model";

export const check = async ({ ctx }: WithContext) => {
  const domain = getSubdomain(ctx.headers.host);
  console.log("aaa domain:", domain);
  if (domain === process.env.NEXT_PUBLIC_APP_SUBDOMAIN) {
    return { domain };
  }

  const workspaceModel = new WorkspaceModel({ ctx });
  const found = await workspaceModel.findByDomain(domain);

  return !!found;
};
