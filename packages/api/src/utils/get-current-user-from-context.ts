import { type Context, type CurrentProfile } from "@acme/shared";

export const getCurrentUserFromContext = (ctx: Context) => {
  return ctx.session?.user;
};

export const getCurrentProfileFromContext = (ctx: Context) => {
  return ctx.session?.user?.profile as CurrentProfile;
};
