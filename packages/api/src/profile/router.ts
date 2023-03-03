import {
  createUserProfileSchema,
  idSchema,
  removeIdsSchema,
  updateUserProfileSchema,
} from "@acme/shared";

import { createTRPCRouter, protectedProcedure } from "~/api/trpc";
import { create, getById, list, remove, update } from "./methods";

export const profileRouter = createTRPCRouter({
  create: protectedProcedure.input(createUserProfileSchema).mutation(create),
  list: protectedProcedure.query(list),
  getById: protectedProcedure.input(idSchema).query(getById),
  update: protectedProcedure.input(updateUserProfileSchema).mutation(update),
  remove: protectedProcedure.input(removeIdsSchema).mutation(remove),
});
