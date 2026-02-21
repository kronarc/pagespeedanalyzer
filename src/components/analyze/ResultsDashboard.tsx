'use client';

import { ScoreGauge } from './ScoreGauge';
import { VitalCard } from './VitalCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface Analysis {
  id: string;
  url: string;
  deviceType: string;
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
  createdAt: string;
}

interface ResultsDashboardProps {
  analysis: Analysis;
}

export function ResultsDashboard({ analysis }: ResultsDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Analysis Results
            </h2>
            <p className="text-muted-foreground mb-1">
              {analysis.url}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {analysis.deviceType.charAt(0).toUpperCase() + analysis.deviceType.slice(1)} • {new Date(analysis.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </Card>

      {/* Lighthouse Scores - Prominent Display */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-6">
          Performance Scores
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScoreGauge label="Performance" score={analysis.performanceScore} />
          <ScoreGauge label="Accessibility" score={analysis.accessibilityScore} />
          <ScoreGauge label="Best Practices" score={analysis.bestPracticesScore} />
          <ScoreGauge label="SEO" score={analysis.seoScore} />
        </div>
      </div>

      {/* Core Web Vitals - Primary Focus */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-6">
          Core Web Vitals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* LCP - Higher priority */}
          <VitalCard
            label="Largest Contentful Paint"
            value={analysis.lcp}
            unit=" ms"
            rating={analysis.lcpRating as any}
            icon="🎨"
            description="Measures loading performance"
          />
          {/* INP - Higher priority */}
          <VitalCard
            label="Interaction to Next Paint"
            value={analysis.inp}
            unit=" ms"
            rating={analysis.inpRating as any}
            icon="⚡"
            description="Measures responsiveness"
          />
          {/* CLS - Higher priority */}
          <VitalCard
            label="Cumulative Layout Shift"
            value={analysis.cls}
            unit=""
            rating={analysis.clsRating as any}
            icon="📐"
            description="Measures visual stability"
          />
          {/* Additional metrics */}
          <VitalCard
            label="First Contentful Paint"
            value={analysis.fcp}
            unit=" ms"
            rating={analysis.fcpRating as any}
            icon="⏱️"
            description="Measures paint timing"
          />
          <VitalCard
            label="Time to First Byte"
            value={analysis.ttfb}
            unit=" ms"
            rating={analysis.ttfbRating as any}
            icon="🌐"
            description="Measures server response"
          />
          <VitalCard
            label="Speed Index"
            value={analysis.speedIndex}
            unit=" ms"
            rating={null}
            icon="📊"
            description="Measures visual completeness"
          />
        </div>
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-card/50 border-primary/10">
        <h4 className="font-semibold text-foreground mb-2">
          ✨ Analysis Complete
        </h4>
        <p className="text-sm text-muted-foreground">
          Overall Performance Score: <span className="font-bold text-primary">{analysis.performanceScore}/100</span>
        </p>
      </Card>
    </div>
  );
}
