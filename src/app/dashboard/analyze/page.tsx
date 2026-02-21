'use client';

import { useState } from 'react';
import { AnalyzeForm } from '@/components/analyze/AnalyzeForm';
import { ResultsDashboard } from '@/components/analyze/ResultsDashboard';
import { Card } from '@/components/ui/card';

export default function AnalyzePage() {
  const [result, setResult] = useState<any>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Analyze Website</h1>
        <p className="text-muted-foreground mt-2">
          Enter a URL to get detailed performance insights using Google PageSpeed Insights
        </p>
      </div>

      {/* Mobile-first layout: Form on top, results below */}
      {result ? (
        // Results view - Full width
        <ResultsDashboard analysis={result} />
      ) : (
        // Form view
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form - Takes 1/3 on desktop, full width on mobile */}
          <div className="lg:col-span-1">
            <AnalyzeForm onAnalyze={setResult} />
          </div>

          {/* Placeholder - Takes 2/3 on desktop, hidden on mobile */}
          <div className="hidden lg:flex lg:col-span-2 items-center">
            <Card className="w-full p-12 text-center border-dashed border-2 border-primary/20">
              <div className="space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-lg font-semibold text-foreground">
                  Ready to Analyze
                </h3>
                <p className="text-muted-foreground">
                  Enter a website URL above and click "Analyze Website" to get detailed performance metrics, Core Web Vitals, and Lighthouse scores.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Back to form button (visible on results view) */}
      {result && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setResult(null)}
            className="text-primary hover:underline font-medium text-sm"
          >
            ← Back to Analyzer
          </button>
        </div>
      )}
    </div>
  );
}
