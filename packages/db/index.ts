import { PrismaClient } from "@prisma/client";

import { logger } from "@acme/logger";
import { emitLogLevels, handlePrismaLogging } from "@acme/logger/logger";

export * from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? emitLogLevels(["query", "error", "warn"])
        : emitLogLevels(["error"]),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

handlePrismaLogging({
  db: prisma,
  logger,
  logLevels: ["info", "warn", "error"],
});
