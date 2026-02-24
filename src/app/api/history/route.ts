import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * PAGE_SIZE;

    const [analyses, total] = await Promise.all([
      prisma.analysis.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.analysis.count({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      analyses,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        pages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (error) {
    console.error('[/api/history]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
