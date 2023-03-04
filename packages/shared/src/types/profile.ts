import { z, type TypeOf } from "zod";

import { idSchema } from "./common";

export const createProfileSchema = z.object({
  firstName: z.string().min(2),
  roleId: z.string().uuid(),
});

export const createUserProfileSchema = z
  .object({
    email: z.string().email(),
    image: z.string().nullish(),
    willInvite: z.boolean(),
  })
  .merge(createProfileSchema);

export const updateUserProfileSchema = z
  .object({
    firstName: z.string().min(2),
    image: z.string().nullish(),
  })
  .merge(idSchema);

export const invitationCodeSchema = z.object({
  invitationCode: z.string().min(1),
});

export const getProfileByInvitationSchema =
  invitationCodeSchema.merge(idSchema);

export type CreateProfileInput = TypeOf<typeof createProfileSchema>;
export type CreateUserProfileInput = TypeOf<typeof createUserProfileSchema>;
export type UpdateUserProfileInput = TypeOf<typeof updateUserProfileSchema>;
export type InvitationCodeInput = TypeOf<typeof invitationCodeSchema>;
export type GetProfileByInvitationInput = TypeOf<
  typeof getProfileByInvitationSchema
>;
