// import { getCurrentProfileFromContext } from "@/utils/helpers/get-current-user-from-context";
import type { Prisma } from "@prisma/client";
import type { Context } from "next-auth";
import type { WithContext } from "@acme/shared";

// import type { ProfileType } from "./auth/helpers/get-session";

export class BaseModel {
  _db: Prisma.TransactionClient;
  _ctx: Context;
  // _currentProfile: ProfileType;

  constructor({ ctx }: WithContext) {
    this._db = ctx.tx ?? ctx.prisma;
    this._ctx = ctx;
    // this._currentProfile = getCurrentProfileFromContext(ctx) as ProfileType;
  }
}
