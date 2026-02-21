import { resetUsageForDate } from '@/lib/usage';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60; // 1 minute

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const secret = request.headers.get('Authorization');
    if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reset yesterday's usage
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await resetUsageForDate(yesterday);

    return NextResponse.json({
      success: true,
      message: `Reset usage for ${yesterday.toISOString().split('T')[0]}`,
    });
  } catch (error) {
    console.error('[/api/cron/reset-usage]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
