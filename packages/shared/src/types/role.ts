import { z, type TypeOf } from "zod";

export const createRoleSchema = z.object({
  title: z.string().min(2),
  isAdmin: z.boolean(),
});

export type CreateRoleInput = TypeOf<typeof createRoleSchema>;
