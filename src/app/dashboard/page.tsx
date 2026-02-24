import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, GitCompare, Lightbulb } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Performance Tools</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Fast, free, and stateless website performance analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/analyze" className="block group">
          <Card className="p-6 h-full border-primary/10 group-hover:border-primary/30 transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Analyze</h3>
            <p className="text-muted-foreground text-sm">
              Run a complete Lighthouse audit and check Core Web Vitals.
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/compare" className="block group">
          <Card className="p-6 h-full border-primary/10 group-hover:border-primary/30 transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GitCompare className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compare</h3>
            <p className="text-muted-foreground text-sm">
              Compare performance scores between two different websites side-by-side.
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/optimize" className="block group">
          <Card className="p-6 h-full border-primary/10 group-hover:border-primary/30 transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lightbulb className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tips</h3>
            <p className="text-muted-foreground text-sm">
              Learn how to improve your scores with our catalog of optimization tips.
            </p>
          </Card>
        </Link>
      </div>

      <Card className="p-12 text-center border-dashed border-2 border-primary/10">
        <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Get detailed insights into any website's performance using Google PageSpeed Insights. No account required.
        </p>
        <Link href="/dashboard/analyze">
          <Button size="lg" className="px-8 h-12 text-lg">
            Launch Analyzer
          </Button>
        </Link>
      </Card>
    </div>
  );
}
