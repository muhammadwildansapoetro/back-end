import prisma from "./client";
import { prismaMock } from "./singleton";

export async function getUser() {
  console.log("Mock call", prisma == prismaMock);
  return prisma.user.findMany();
}
