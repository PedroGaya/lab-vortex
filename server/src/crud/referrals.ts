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

function prismaDataToReferral(ref: PrismaReferral): Referral {
  return {
    id: ref.id,
    fromUserId: ref.fromUserId,
    followedThrough: ref.followedThrough,
  };
}
