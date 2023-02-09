import type { Context } from "next-auth";
import type { Prisma } from "@acme/db";
import type { CurrentProfile, WithContext } from "@acme/shared";

import { getCurrentProfileFromContext } from "~/api/utils/get-current-user-from-context";

export class BaseModel {
  _db: Prisma.TransactionClient;
  _ctx: Context;
  _currentProfile: CurrentProfile;

  constructor({ ctx }: WithContext) {
    this._db = ctx.tx ?? ctx.prisma;
    this._ctx = ctx;
    this._currentProfile = getCurrentProfileFromContext(ctx) as CurrentProfile;
  }
}
