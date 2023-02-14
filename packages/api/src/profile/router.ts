import { createUserProfileSchema, removeIdsSchema } from "@acme/shared";

import { createTRPCRouter, protectedProcedure } from "~/api/trpc";
import { create, list, remove } from "./methods";

export const profileRouter = createTRPCRouter({
  create: protectedProcedure.input(createUserProfileSchema).mutation(create),
  list: protectedProcedure.query(list),
  remove: protectedProcedure.input(removeIdsSchema).mutation(remove),
});
