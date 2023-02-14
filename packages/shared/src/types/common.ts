import { z, type TypeOf } from "zod";

export const removeIdsSchema = z.array(z.string());

export type RemoveIdsInput = TypeOf<typeof removeIdsSchema>;
