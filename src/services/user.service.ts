// src/services/user.service.ts
import prisma from "../database/prismaclient";

export const getAllUsersService = async (currentUserId: number) => {
  return prisma.user.findMany({
    where: { NOT: { id: currentUserId } },
    select: { id: true, username: true, email: true }
  });
};
