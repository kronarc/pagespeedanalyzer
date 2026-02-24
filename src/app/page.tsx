import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            PageSpeedAnalyzer
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="default">Launch App</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            Analyze Website Performance
          </h1>
          <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Get instant insights into your website's performance using Google PageSpeed Insights.
            Track Core Web Vitals, Lighthouse scores, and optimize for better user experience.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link href="/dashboard/analyze">
              <Button size="lg" className="text-lg px-8 h-14">
                Start Analyzing Now
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No account or database required. Fast & Stateless.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Core Web Vitals
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Track LCP, CLS, INP and other critical metrics that impact user experience.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Detailed Reports
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Get comprehensive Lighthouse audits with actionable recommendations.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Compare Sites
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Run side-by-side comparisons to see how your site stacks up against competitors.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
