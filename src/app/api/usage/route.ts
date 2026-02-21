import { auth } from '@/lib/auth';
import { getUsageToday } from '@/lib/usage';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || null;
    const subscriptionStatus = (session?.user as any)?.subscriptionStatus || 'free';

    const usage = await getUsageToday(userId, ipAddress);
    const limit = subscriptionStatus === 'active' ? -1 : 5;

    return NextResponse.json({
      current: usage,
      limit,
      isPaid: subscriptionStatus === 'active',
    });
  } catch (error) {
    console.error('[/api/usage]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
