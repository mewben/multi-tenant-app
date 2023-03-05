const { execSync } = require("node:child_process");

module.exports = function () {
  console.log("global---api---setup");
  execSync(
    `pnpm prisma db push --force-reset --accept-data-loss --schema ./packages/db/prisma/schema.prisma`,
  );
};
