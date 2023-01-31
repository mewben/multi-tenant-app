import { execSync } from "node:child_process";

export default function () {
  // reset once before all tests
  execSync(
    `pnpm prisma db push --force-reset --accept-data-loss --schema ./packages/db/prisma/schema.prisma`,
  );
}
