/**
 * Google PageSpeed Insights API v5 wrapper
 */

interface PSIResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      'best-practices': { score: number };
      seo: { score: number };
    };
    audits: {
      'speed-index': {
        numericValue?: number;
      };
      'largest-contentful-paint': {
        numericValue?: number;
      };
      'cumulative-layout-shift': {
        numericValue?: number;
      };
      'first-contentful-paint': {
        numericValue?: number;
      };
      'interaction-to-next-paint': {
        numericValue?: number;
      };
      'server-response-time': {
        numericValue?: number;
      };
    };
  };
  loadingExperience?: {
    metrics: {
      LARGEST_CONTENTFUL_PAINT_MS?: {
        percentile: number;
        distributions: Array<{
          proportionMin: number;
          proportionMax: number;
          min: number;
          max: number;
          proportion: number;
        }>;
        category: 'FAST' | 'AVERAGE' | 'SLOW';
      };
      CUMULATIVE_LAYOUT_SHIFT_SCORE?: {
        percentile: number;
        distributions: Array<{
          proportionMin: number;
          proportionMax: number;
          min: number;
          max: number;
          proportion: number;
        }>;
        category: 'FAST' | 'AVERAGE' | 'SLOW';
      };
      INTERACTION_TO_NEXT_PAINT_MS?: {
        percentile: number;
        distributions: Array<{
          proportionMin: number;
          proportionMax: number;
          min: number;
          max: number;
          proportion: number;
        }>;
        category: 'FAST' | 'AVERAGE' | 'SLOW';
      };
      FIRST_CONTENTFUL_PAINT_MS?: {
        percentile: number;
        distributions: Array<{
          proportionMin: number;
          proportionMax: number;
          min: number;
          max: number;
          proportion: number;
        }>;
        category: 'FAST' | 'AVERAGE' | 'SLOW';
      };
      FIRST_INPUT_DELAY_MS?: {
        percentile: number;
        distributions: Array<{
          proportionMin: number;
          proportionMax: number;
          min: number;
          max: number;
          proportion: number;
        }>;
        category: 'FAST' | 'AVERAGE' | 'SLOW';
      };
    };
  };
}

export interface AnalysisResult {
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  speedIndex: number | null;
  lcp: number | null;
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  ttfb: number | null;
  lcpRating: string | null;
  clsRating: string | null;
  inpRating: string | null;
  fcpRating: string | null;
  ttfbRating: string | null;
  lighthouseJson: string;
}

function categoryToRating(category: 'FAST' | 'AVERAGE' | 'SLOW'): string {
  switch (category) {
    case 'FAST':
      return 'good';
    case 'AVERAGE':
      return 'needs-improvement';
    case 'SLOW':
      return 'poor';
    default:
      return 'poor';
  }
}

export async function analyzePage(
  url: string,
  strategy: 'mobile' | 'desktop' = 'mobile'
): Promise<AnalysisResult> {
  const apiKey = process.env.GOOGLE_PSI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_PSI_API_KEY is not set');
  }

  const psiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  psiUrl.searchParams.set('url', url);
  psiUrl.searchParams.set('key', apiKey);
  psiUrl.searchParams.set('strategy', strategy);

  const response = await fetch(psiUrl.toString());

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`PSI API error: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
  }

  const data: PSIResponse = await response.json();

  const lighthouse = data.lighthouseResult;
  const crunx = data.loadingExperience?.metrics || {};

  return {
    performanceScore: Math.round((lighthouse.categories.performance?.score || 0) * 100),
    accessibilityScore: Math.round((lighthouse.categories.accessibility?.score || 0) * 100),
    bestPracticesScore: Math.round((lighthouse.categories['best-practices']?.score || 0) * 100),
    seoScore: Math.round((lighthouse.categories.seo?.score || 0) * 100),
    speedIndex: lighthouse.audits['speed-index']?.numericValue ?? null,
    lcp: crunx.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
    cls: crunx.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? null,
    inp: crunx.INTERACTION_TO_NEXT_PAINT_MS?.percentile ?? null,
    fcp: crunx.FIRST_CONTENTFUL_PAINT_MS?.percentile ?? null,
    ttfb: lighthouse.audits['server-response-time']?.numericValue ?? null,
    lcpRating: crunx.LARGEST_CONTENTFUL_PAINT_MS
      ? categoryToRating(crunx.LARGEST_CONTENTFUL_PAINT_MS.category)
      : null,
    clsRating: crunx.CUMULATIVE_LAYOUT_SHIFT_SCORE
      ? categoryToRating(crunx.CUMULATIVE_LAYOUT_SHIFT_SCORE.category)
      : null,
    inpRating: crunx.INTERACTION_TO_NEXT_PAINT_MS
      ? categoryToRating(crunx.INTERACTION_TO_NEXT_PAINT_MS.category)
      : null,
    fcpRating: crunx.FIRST_CONTENTFUL_PAINT_MS
      ? categoryToRating(crunx.FIRST_CONTENTFUL_PAINT_MS.category)
      : null,
    ttfbRating: null, // TTFB doesn't have CrUX category
    lighthouseJson: JSON.stringify(data),
  };
}
    speedIndex: lighthouse.audits['speed-index']?.numericValue ?? null,
    lcp: crunx.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
    cls: crunx.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? null,
    inp: crunx.INTERACTION_TO_NEXT_PAINT_MS?.percentile ?? null,
    fcp: crunx.FIRST_CONTENTFUL_PAINT_MS?.percentile ?? null,
    ttfb: lighthouse.audits['server-response-time']?.numericValue ?? null,
    lcpRating: crunx.LARGEST_CONTENTFUL_PAINT_MS
      ? categoryToRating(crunx.LARGEST_CONTENTFUL_PAINT_MS.category)
      : null,
    clsRating: crunx.CUMULATIVE_LAYOUT_SHIFT_SCORE
      ? categoryToRating(crunx.CUMULATIVE_LAYOUT_SHIFT_SCORE.category)
      : null,
    inpRating: crunx.INTERACTION_TO_NEXT_PAINT_MS
      ? categoryToRating(crunx.INTERACTION_TO_NEXT_PAINT_MS.category)
      : null,
    fcpRating: crunx.FIRST_CONTENTFUL_PAINT_MS
      ? categoryToRating(crunx.FIRST_CONTENTFUL_PAINT_MS.category)
      : null,
    ttfbRating: null, // TTFB doesn't have CrUX category
    lighthouseJson: JSON.stringify(data),
  };
}
