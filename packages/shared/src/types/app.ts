import type { Context } from "next-auth";
import type { Prisma, PrismaClient } from "@acme/db";

export interface WithPrisma {
  prisma: PrismaClient;
  tx?: Prisma.TransactionClient;
}

export interface WithContext {
  ctx: Context;
}

export interface CurrentUser {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  profile?: CurrentProfile;
}

export interface CurrentProfile {
  id: string;
  firstName: string;
  workspace: CurrentWorkspace;
  role: CurrentRole;
}

interface CurrentWorkspace {
  id: string;
  domain: string;
  title: string;
}

interface CurrentRole {
  id: string;
  title: string;
  isAdmin: boolean;
}

export interface ShouldThrow {
  shouldThrow?: boolean;
}

export type GlobalReject =
  | Prisma.RejectOnNotFound
  | Prisma.RejectPerOperation
  | false
  | undefined;
