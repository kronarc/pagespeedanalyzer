'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ComparisonResult {
  url: string;
  score: number;
  lcp: number | null;
  cls: number | null;
  inp: number | null;
}

export function ComparisonTool() {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    site1: ComparisonResult | null;
    site2: ComparisonResult | null;
  }>({ site1: null, site2: null });

  const handleAnalyze = async () => {
    let formattedUrl1 = url1.trim();
    let formattedUrl2 = url2.trim();

    if (!formattedUrl1 || !formattedUrl2) {
      toast.error('Please enter both URLs');
      return;
    }

    // Auto-add https:// if protocol is missing
    if (!/^https?:\/\//i.test(formattedUrl1)) {
      formattedUrl1 = `https://${formattedUrl1}`;
      setUrl1(formattedUrl1);
    }
    if (!/^https?:\/\//i.test(formattedUrl2)) {
      formattedUrl2 = `https://${formattedUrl2}`;
      setUrl2(formattedUrl2);
    }

    setLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: formattedUrl1, deviceType: 'mobile' }),
        }),
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: formattedUrl2, deviceType: 'mobile' }),
        }),
      ]);

      if (!res1.ok || !res2.ok) {
        toast.error('Failed to analyze one or both URLs');
        setLoading(false);
        return;
      }

      const data1 = await res1.json();
      const data2 = await res2.json();

      setResults({
        site1: {
          url: formattedUrl1,
          score: data1.data.performanceScore,
          lcp: data1.data.lcp,
          cls: data1.data.cls,
          inp: data1.data.inp,
        },
        site2: {
          url: formattedUrl2,
          score: data2.data.performanceScore,
          lcp: data2.data.lcp,
          cls: data2.data.cls,
          inp: data2.data.inp,
        },
      });

      toast.success('Comparison complete!');
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#0cce6b]';
    if (score >= 50) return 'text-[#ffa400]';
    return 'text-[#ff4e42]';
  };

  const getWinner = (
    value1: number | null,
    value2: number | null,
    isMetric: boolean = true
  ) => {
    if (value1 === null || value2 === null) return null;
    // For performance scores and LCP/FCP, higher is better
    // For CLS, lower is better
    if (isMetric) {
      if (value1 < value2) return 1;
      if (value1 > value2) return 2;
    } else {
      if (value1 > value2) return 1;
      if (value1 < value2) return 2;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Compare Two Websites
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">
              First Website URL
            </label>
            <Input
              type="text"
              placeholder="https://example1.com"
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              disabled={loading}
              className="h-11"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">
              Second Website URL
            </label>
            <Input
              type="text"
              placeholder="https://example2.com"
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              disabled={loading}
              className="h-11"
            />
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full md:w-auto h-11"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? 'Analyzing...' : 'Compare Websites'}
        </Button>
      </Card>

      {/* Results Section */}
      {results.site1 && results.site2 && (
        <div className="space-y-8">
          {/* Performance Score Comparison */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-6">
              Performance Scores
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site 1 */}
              <Card className="p-6 relative">
                {getWinner(
                  results.site1.score,
                  results.site2.score,
                  false
                ) === 1 && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold">
                    🏆 Winner
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-3 truncate">
                  {results.site1.url}
                </p>
                <div className={`text-5xl font-bold ${getScoreColor(results.site1.score)}`}>
                  {results.site1.score}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Performance Score
                </p>
              </Card>

              {/* Site 2 */}
              <Card className="p-6 relative">
                {getWinner(
                  results.site1.score,
                  results.site2.score,
                  false
                ) === 2 && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold">
                    🏆 Winner
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-3 truncate">
                  {results.site2.url}
                </p>
                <div className={`text-5xl font-bold ${getScoreColor(results.site2.score)}`}>
                  {results.site2.score}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Performance Score
                </p>
              </Card>
            </div>
          </div>

          {/* Core Web Vitals Comparison */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-6">
              Core Web Vitals Comparison
            </h3>

            <div className="space-y-4">
              {/* LCP */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">
                    Largest Contentful Paint (LCP)
                  </h4>
                  <p className="text-xs text-muted-foreground">Lower is better</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={getWinner(results.site1.lcp, results.site2.lcp, true) === 1 ? 'border-2 border-primary rounded-lg p-4' : 'p-4'}>
                    <p className="text-sm text-muted-foreground mb-2">Site 1</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.site1.lcp ? `${results.site1.lcp.toFixed(0)}ms` : 'N/A'}
                    </p>
                    {getWinner(results.site1.lcp, results.site2.lcp, true) === 1 && (
                      <Badge className="mt-2" variant="good">✓ Better</Badge>
                    )}
                  </div>
                  <div className={getWinner(results.site1.lcp, results.site2.lcp, true) === 2 ? 'border-2 border-primary rounded-lg p-4' : 'p-4'}>
                    <p className="text-sm text-muted-foreground mb-2">Site 2</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.site2.lcp ? `${results.site2.lcp.toFixed(0)}ms` : 'N/A'}
                    </p>
                    {getWinner(results.site1.lcp, results.site2.lcp, true) === 2 && (
                      <Badge className="mt-2" variant="good">✓ Better</Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* CLS */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">
                    Cumulative Layout Shift (CLS)
                  </h4>
                  <p className="text-xs text-muted-foreground">Lower is better</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={getWinner(results.site1.cls, results.site2.cls, true) === 1 ? 'border-2 border-primary rounded-lg p-4' : 'p-4'}>
                    <p className="text-sm text-muted-foreground mb-2">Site 1</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.site1.cls ? results.site1.cls.toFixed(2) : 'N/A'}
                    </p>
                    {getWinner(results.site1.cls, results.site2.cls, true) === 1 && (
                      <Badge className="mt-2" variant="good">✓ Better</Badge>
                    )}
                  </div>
                  <div className={getWinner(results.site1.cls, results.site2.cls, true) === 2 ? 'border-2 border-primary rounded-lg p-4' : 'p-4'}>
                    <p className="text-sm text-muted-foreground mb-2">Site 2</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.site2.cls ? results.site2.cls.toFixed(2) : 'N/A'}
                    </p>
                    {getWinner(results.site1.cls, results.site2.cls, true) === 2 && (
                      <Badge className="mt-2" variant="good">✓ Better</Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* INP */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">
                    Interaction to Next Paint (INP)
                  </h4>
                  <p className="text-xs text-muted-foreground">Lower is better</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={getWinner(results.site1.inp, results.site2.inp, true) === 1 ? 'border-2 border-primary rounded-lg p-4' : 'p-4'}>
                    <p className="text-sm text-muted-foreground mb-2">Site 1</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.site1.inp ? `${results.site1.inp.toFixed(0)}ms` : 'N/A'}
                    </p>
                    {getWinner(results.site1.inp, results.site2.inp, true) === 1 && (
                      <Badge className="mt-2" variant="good">✓ Better</Badge>
                    )}
                  </div>
                  <div className={getWinner(results.site1.inp, results.site2.inp, true) === 2 ? 'border-2 border-primary rounded-lg p-4' : 'p-4'}>
                    <p className="text-sm text-muted-foreground mb-2">Site 2</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.site2.inp ? `${results.site2.inp.toFixed(0)}ms` : 'N/A'}
                    </p>
                    {getWinner(results.site1.inp, results.site2.inp, true) === 2 && (
                      <Badge className="mt-2" variant="good">✓ Better</Badge>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => {
                setResults({ site1: null, site2: null });
                setUrl1('');
                setUrl2('');
              }}
              variant="outline"
            >
              New Comparison
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
