import { z, type TypeOf } from "zod";

export const idSchema = z.object({
  id: z.string().uuid(),
});
export const removeIdsSchema = z.array(z.string());

export type IdInput = TypeOf<typeof idSchema>;
export type RemoveIdsInput = TypeOf<typeof removeIdsSchema>;
export interface WithChildren {
  children: React.ReactNode;
}

export interface WithLoading {
  isLoading: boolean;
}
