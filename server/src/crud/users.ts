import { prisma } from "../prisma";

import type { User as PrismaUser } from "../../generated/prisma";
import type { UserParams, User } from "../types/user";
import { generateRefCode, hashPassword, verifyPassword } from "../auth";

export async function getUsers(): Promise<User[]> {
  const data = await prisma.user.findMany({
    include: {
      referrals: false,
    },
  });

  return data.map(prismaDataToUser);
}

export async function findUserById(id: string): Promise<User> {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: id,
    },
    include: {
      referrals: false,
    },
  });

  return prismaDataToUser(user);
}

export async function findUserByRefCode(refCode: string): Promise<User> {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      refCode: refCode,
    },
    include: {
      referrals: false,
    },
  });

  return prismaDataToUser(user);
}

export async function findUserByNameOrEmail(
  nameOrEmail: string
): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ name: nameOrEmail }, { email: nameOrEmail }],
    },
    include: {
      referrals: false,
    },
  });

  if (!user) return null;
  return prismaDataToUser(user);
}

export async function verifyUser(identifier: string, password: string) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      OR: [{ name: identifier }, { email: identifier }],
    },
  });

  if (!user) return null;

  const isValid = await verifyPassword(password, user.pwd);
  if (!isValid) return null;

  return prismaDataToUser(user);
}

export async function createUser(data: UserParams): Promise<User> {
  const { name, email, pwd } = data;

  const hashedPassword = await hashPassword(pwd);
  const refCode = generateRefCode(name);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      pwd: hashedPassword,
      refCode,
    },
  });

  return prismaDataToUser(user);
}

export async function deleteUser(userId: string) {
  const deleted = await prisma.user.delete({
    where: { id: userId },
  });

  return prismaDataToUser(deleted);
}

export async function updateRefCount(userId: string, newCount: number) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      refCount: newCount,
    },
  });

  return prismaDataToUser(user);
}

export async function incrementRefCount(userId: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      refCount: {
        increment: 1,
      },
    },
  });

  return prismaDataToUser(user);
}

function prismaDataToUser(user: PrismaUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    refCode: user.refCode,
    refCount: user.refCount,
  };
}
