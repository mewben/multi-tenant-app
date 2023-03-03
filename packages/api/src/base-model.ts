import type { Prisma } from "@acme/db";
import type { Context, CurrentProfile, WithContext } from "@acme/shared";

import { getCurrentProfileFromContext } from "~/api/utils/get-current-user-from-context";

export class BaseModel {
  _db: Prisma.TransactionClient;
  _ctx: Context;
  _currentProfile: CurrentProfile;
  _workspaceId: string;

  constructor({ ctx }: WithContext) {
    this._db = ctx.tx ?? ctx.prisma;
    this._ctx = ctx;
    this._currentProfile = getCurrentProfileFromContext(ctx);
    this._workspaceId = this._currentProfile?.workspace.id;
  }
}
