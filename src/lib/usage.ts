import { prisma } from './prisma';

const FREE_TIER_LIMIT = 5; // 5 analyses per day

export async function getUsageToday(userId: string | null, ipAddress: string | null) {
  if (!userId && !ipAddress) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const log = userId
    ? await prisma.usageLog.findUnique({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
      })
    : await prisma.usageLog.findFirst({
        where: {
          ipAddress,
          date: today,
        },
      });

  return log?.count ?? 0;
}

export async function checkUsageAllowed(
  userId: string | null,
  ipAddress: string | null,
  subscriptionStatus: string | null
): Promise<boolean> {
  // Paid users have unlimited analyses
  if (subscriptionStatus === 'active') {
    return true;
  }

  // Free users are limited to 5 per day
  const usage = await getUsageToday(userId, ipAddress);
  return usage < FREE_TIER_LIMIT;
}

export async function incrementUsage(userId: string | null, ipAddress: string | null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (userId) {
    await prisma.usageLog.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        count: {
          increment: 1,
        },
      },
      create: {
        userId,
        date: today,
        count: 1,
      },
    });
  } else if (ipAddress) {
    await prisma.usageLog.upsert({
      where: {
        userId_date: {
          userId: null,
          date: today,
        },
      },
      update: {
        count: {
          increment: 1,
        },
      },
      create: {
        ipAddress,
        date: today,
        count: 1,
      },
    });
  }
}

export async function resetUsageForDate(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  await prisma.usageLog.deleteMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
}
