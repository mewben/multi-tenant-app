import { onboardingSchema, verifyUserSchema } from "@acme/shared";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/api/trpc";
import { onboard, verify } from "./methods";

export const userRouter = createTRPCRouter({
  verify: publicProcedure.input(verifyUserSchema).mutation(verify),
  onboard: protectedProcedure.input(onboardingSchema).mutation(onboard),
});
