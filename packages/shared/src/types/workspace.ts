import { z, type TypeOf } from "zod";

export const createWorkspaceSchema = z.object({
  title: z.string().min(2),
  domain: z.string().min(2),
});

export type CreateWorkspaceInput = TypeOf<typeof createWorkspaceSchema>;
