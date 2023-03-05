const { prisma } = require("../../../packages/db");

module.exports = async function () {
  console.log("---- prisma disconnecting....");
  await new Promise((resolve) => setTimeout(() => resolve(), 1000));
  await prisma.$disconnect();
};
