import type { Context } from "next-auth";
import { throwError } from "@acme/shared";

import { getCurrentProfileFromContext } from "./get-current-user-from-context";

export const prepareInsertBaseData = (ctx: Context) => {
  const currentProfile = getCurrentProfileFromContext(ctx);
  if (!currentProfile) return throwError(`tn.error:profile.noCurrent`);

  return {
    workspaceId: currentProfile.workspace.id,
    createdBy: currentProfile.id,
    updatedBy: currentProfile.id,
  };
};

export const prepareUpdateBaseData = (ctx: Context) => {
  const currentProfile = getCurrentProfileFromContext(ctx);
  if (!currentProfile) return throwError(`tn.error:profile.noCurrent`);

  return {
    updatedBy: currentProfile.id,
    updatedAt: new Date(),
  };
};
