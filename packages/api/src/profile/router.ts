import {
  createUserProfileSchema,
  getProfileByInvitationSchema,
  idSchema,
  invitationCodeSchema,
  removeIdsSchema,
  updateUserProfileSchema,
} from "@acme/shared";

import {
  authedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/api/trpc";
import {
  acceptInvitation,
  create,
  getById,
  getByInvitation,
  list,
  remove,
  update,
} from "./methods";

export const profileRouter = createTRPCRouter({
  acceptInvitation: authedProcedure
    .input(invitationCodeSchema)
    .mutation(acceptInvitation),
  create: protectedProcedure.input(createUserProfileSchema).mutation(create),
  list: protectedProcedure.query(list),
  getById: protectedProcedure.input(idSchema).query(getById),
  // public
  getByInvitation: publicProcedure
    .input(getProfileByInvitationSchema)
    .query(getByInvitation),
  update: protectedProcedure.input(updateUserProfileSchema).mutation(update),
  remove: protectedProcedure.input(removeIdsSchema).mutation(remove),
});
