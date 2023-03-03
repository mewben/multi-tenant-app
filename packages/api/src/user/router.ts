import {
  forgotPasswordSchema,
  onboardingSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  verifyUserSchema,
} from "@acme/shared";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/api/trpc";
import {
  forgotPassword,
  onboard,
  resetPassword,
  updatePassword,
  verify,
} from "./methods";

export const userRouter = createTRPCRouter({
  verify: publicProcedure.input(verifyUserSchema).mutation(verify),
  onboard: protectedProcedure.input(onboardingSchema).mutation(onboard),
  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(forgotPassword),
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(resetPassword),
  updatePassword: protectedProcedure
    .input(updatePasswordSchema)
    .mutation(updatePassword),
});
