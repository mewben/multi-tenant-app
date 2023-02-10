const { execSync } = require("node:child_process");

module.exports = function () {
  execSync(
    `pnpm prisma db push --force-reset --accept-data-loss --schema ./packages/db/prisma/schema.prisma`,
  );
};
