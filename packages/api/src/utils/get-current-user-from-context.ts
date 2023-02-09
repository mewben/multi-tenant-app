import type { Context } from "next-auth";

export const getCurrentUserFromContext = (ctx: Context) => {
  return ctx.session?.user;
};

export const getCurrentProfileFromContext = (ctx: Context) => {
  return ctx.session?.user?.profile;
};
