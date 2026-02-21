import { auth } from '@/lib/auth';
import { analyzePage } from '@/lib/pagespeed';
import { checkUsageAllowed, incrementUsage, getUsageToday } from '@/lib/usage';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300; // 5 minutes timeout for analysis

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const { url, deviceType = 'mobile' } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const userId = session?.user?.id || null;
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || null;
    const subscriptionStatus = (session?.user as any)?.subscriptionStatus || 'free';

    // Check usage limits
    const allowed = await checkUsageAllowed(userId, ipAddress, subscriptionStatus);
    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Daily limit exceeded',
          message: 'Free tier users are limited to 5 analyses per day. Please upgrade to continue.',
        },
        { status: 429 }
      );
    }

    // Run analysis
    const result = await analyzePage(url, deviceType);

    // Save to database
    const analysis = await prisma.analysis.create({
      data: {
        userId: userId || undefined,
        url,
        deviceType,
        performanceScore: result.performanceScore,
        accessibilityScore: result.accessibilityScore,
        bestPracticesScore: result.bestPracticesScore,
        seoScore: result.seoScore,
        speedIndex: result.speedIndex,
        lcp: result.lcp,
        cls: result.cls,
        inp: result.inp,
        fcp: result.fcp,
        ttfb: result.ttfb,
        lcpRating: result.lcpRating,
        clsRating: result.clsRating,
        inpRating: result.inpRating,
        fcpRating: result.fcpRating,
        ttfbRating: result.ttfbRating,
        // Only store full Lighthouse JSON for paid users
        lighthouseJson:
          subscriptionStatus === 'active'
            ? result.lighthouseJson
            : undefined,
      },
    });

    // Increment usage
    await incrementUsage(userId, ipAddress);

    // Get updated usage
    const usage = await getUsageToday(userId, ipAddress);

    return NextResponse.json(
      {
        data: analysis,
        usage: {
          current: usage,
          limit: subscriptionStatus === 'active' ? -1 : 5,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[/api/analyze]', error);

    if (error instanceof Error && error.message.includes('PSI API')) {
      return NextResponse.json(
        { error: 'Failed to analyze page. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
