/**
 * Core Web Vitals thresholds and rating logic
 * Based on: https://web.dev/articles/vitals
 */

export const CWV_THRESHOLDS = {
  // Largest Contentful Paint (in milliseconds)
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  // Cumulative Layout Shift (unitless)
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // Interaction to Next Paint (in milliseconds)
  INP: {
    good: 200,
    needsImprovement: 500,
  },
  // First Contentful Paint (in milliseconds)
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  // Time to First Byte (in milliseconds)
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
};

export type Rating = 'good' | 'needs-improvement' | 'poor';

export function getRating(metric: string, value: number): Rating {
  const thresholds = CWV_THRESHOLDS[metric as keyof typeof CWV_THRESHOLDS];
  if (!thresholds) return 'poor';

  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

export const RATING_COLORS = {
  good: '#0cce6b',
  'needs-improvement': '#ffa400',
  poor: '#ff4e42',
};

export const RATING_LABELS = {
  good: 'Good',
  'needs-improvement': 'Needs Improvement',
  poor: 'Poor',
};

export const LIGHTHOUSE_SCORE_COLORS = {
  90: '#0cce6b', // green
  50: '#ffa400',  // orange
  0: '#ff4e42',   // red
};

export function getLighthouseScoreColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return '#888888';
  if (score >= 90) return LIGHTHOUSE_SCORE_COLORS[90];
  if (score >= 50) return LIGHTHOUSE_SCORE_COLORS[50];
  return LIGHTHOUSE_SCORE_COLORS[0];
}
