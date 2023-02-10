const { prisma } = require("../../../packages/db");

module.exports = async function () {
  await prisma.$disconnect();
};
