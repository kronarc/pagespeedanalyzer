import { analyzePage } from '@/lib/pagespeed';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300; // 5 minutes timeout for analysis
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
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

    // Run analysis directly without saving to DB
    const result = await analyzePage(url, deviceType);

    // Return the result directly
    return NextResponse.json(
      {
        data: {
          id: Math.random().toString(36).substring(7),
          url,
          deviceType,
          ...result,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[/api/analyze]', error);

    if (error.message.includes('GOOGLE_PSI_API_KEY')) {
      return NextResponse.json(
        { 
          error: 'Configuration Error', 
          message: 'GOOGLE_PSI_API_KEY is missing from environment variables. Please add it to your Vercel Dashboard Settings.' 
        },
        { status: 500 }
      );
    }

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
