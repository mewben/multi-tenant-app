import { z, type TypeOf } from "zod";

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

export type CreateProfileInput = TypeOf<typeof createProfileSchema>;
export type CreateUserProfileInput = TypeOf<typeof createUserProfileSchema>;
