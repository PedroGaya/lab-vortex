import { prisma } from "../prisma";

import type { Referral as PrismaReferral } from "../../generated/prisma";
import type { Referral, ReferralParams } from "../types/referral";
import { findUserByRefCode, incrementRefCount } from "./users";

export async function createReferral(data: ReferralParams): Promise<Referral> {
  const { refCode, followedThrough } = data;

  const fromUser = await findUserByRefCode(refCode);

  const ref = await prisma.referral.create({
    data: {
      from: {
        connect: {
          id: fromUser.id,
        },
      },
      followedThrough,
    },
  });

  if (followedThrough) await incrementRefCount(fromUser.id);

  return prismaDataToReferral(ref);
}

export async function getRefs(): Promise<Referral[]> {
  const refs = await prisma.referral.findMany();

  return refs.map(prismaDataToReferral);
}

export async function findReferralById(id: string): Promise<Referral> {
  const ref = await prisma.referral.findFirstOrThrow({
    where: {
      id: id,
    },
  });

  return prismaDataToReferral(ref);
}

export async function deleteReferral(refId: string) {
  const ref = await prisma.referral.delete({
    where: { id: refId },
  });

  return prismaDataToReferral(ref);
}

function prismaDataToReferral(ref: PrismaReferral): Referral {
  return {
    id: ref.id,
    fromUserId: ref.fromUserId,
    followedThrough: ref.followedThrough,
  };
}
