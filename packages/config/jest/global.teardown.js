import { prisma } from "../../../packages/db";

export default async function () {
  await prisma.$disconnect();
}
