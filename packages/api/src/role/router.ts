import { createTRPCRouter, protectedProcedure } from "~/api/trpc";
import { list } from "./methods";

export const roleRouter = createTRPCRouter({
  list: protectedProcedure.query(list),
});
