import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { roleRouter } from "~/api/role/router";
import { userRouter } from "~/api/user/router";
import { workspaceRouter } from "~/api/workspace/router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  role: roleRouter,
  user: userRouter,
  workspace: workspaceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
