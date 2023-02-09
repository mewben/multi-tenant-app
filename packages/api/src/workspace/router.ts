import { createWorkspaceSchema } from "@acme/shared";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/api/trpc";
import { check, create } from "./methods";

export const workspaceRouter = createTRPCRouter({
  check: publicProcedure.query(check),
  create: protectedProcedure.input(createWorkspaceSchema).mutation(create),
});
