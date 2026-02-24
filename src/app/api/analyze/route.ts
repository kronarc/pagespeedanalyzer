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

    // Run analysis
    let result;
    try {
      result = await analyzePage(url, deviceType);
    } catch (error: any) {
      if (error.message.includes('GOOGLE_PSI_API_KEY')) {
        const envKeys = Object.keys(process.env).filter(k => k.includes('PSI') || k.includes('GOOGLE'));
        return NextResponse.json(
          { 
            error: 'Configuration Error', 
            message: `GOOGLE_PSI_API_KEY is not found by the server. Found similar keys: [${envKeys.join(', ')}]. If empty, please Redeploy in Vercel after saving the variable.` 
          },
          { status: 500 }
        );
      }
      throw error;
    }

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
        // Store full Lighthouse JSON for all users
        lighthouseJson: result.lighthouseJson,
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
          limit: -1, // Unlimited
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[/api/analyze]', error);

    if (error instanceof Error && error.message.includes('PSI API')) {
      return NextResponse.json(
        { 
          error: 'Failed to analyze page',
          message: error.message 
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
