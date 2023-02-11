import { createWorkspaceSchema } from "@acme/shared";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/api/trpc";
import { check, create, list } from "./methods";

export const workspaceRouter = createTRPCRouter({
  check: publicProcedure.query(check),
  create: protectedProcedure.input(createWorkspaceSchema).mutation(create),
  list: protectedProcedure.query(list),
});
