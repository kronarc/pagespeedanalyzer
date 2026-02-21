import { auth } from '@/lib/auth';
import { getUsageToday } from '@/lib/usage';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const subscriptionStatus = (session?.user as any)?.subscriptionStatus || 'free';

  if (!userId) {
    return <div>Not authenticated</div>;
  }

  // Get usage for today
  const usage = await getUsageToday(userId, null);
  const limit = subscriptionStatus === 'active' ? -1 : 5;

  // Get latest analyses
  const recentAnalyses = await prisma.analysis.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Welcome back! Here's your performance analysis overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-primary/10">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Analyses Today
          </h3>
          <div className="flex items-baseline gap-1">
            <div className="text-4xl font-bold text-foreground">
              {usage}
            </div>
            {limit !== -1 && (
              <span className="text-lg text-muted-foreground font-medium">
                /{limit}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground/70 mt-3">
            {limit === -1
              ? '♾️ Unlimited (Pro)'
              : `${limit - usage} remaining today`}
          </p>
        </Card>

        <Card className="p-6 border-primary/10">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Total Analyses
          </h3>
          <div className="text-4xl font-bold text-foreground">
            {recentAnalyses.length}
          </div>
          <p className="text-xs text-muted-foreground/70 mt-3">
            All time
          </p>
        </Card>

        <Card className="p-6 border-primary/20 bg-primary/5">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Subscription
          </h3>
          <div className="text-3xl font-bold text-primary capitalize mb-3">
            {subscriptionStatus === 'active' ? '⭐ Pro' : 'Free'}
          </div>
          {subscriptionStatus !== 'active' && (
            <Link href="/pricing" className="text-xs font-medium text-primary hover:underline block">
              Upgrade to Pro →
            </Link>
          )}
        </Card>
      </div>

      {/* Recent Analyses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Recent Analyses
          </h2>
          <Link href="/dashboard/analyze">
            <Button>New Analysis</Button>
          </Link>
        </div>

        {recentAnalyses.length > 0 ? (
          <div className="space-y-2">
            {recentAnalyses.map((analysis: any) => {
              const getScoreColor = (score: number) => {
                if (score >= 90) return 'text-[#0cce6b]';
                if (score >= 50) return 'text-[#ffa400]';
                return 'text-[#ff4e42]';
              };

              return (
                <Card key={analysis.id} className="p-4 hover:shadow-lg transition-shadow hover:border-primary/20 cursor-pointer">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate text-sm">
                        {analysis.url}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {analysis.deviceType.charAt(0).toUpperCase() + analysis.deviceType.slice(1)} • {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.performanceScore)}`}>
                          {analysis.performanceScore}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                          Performance
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              No analyses yet. Start by analyzing a website!
            </p>
            <Link href="/dashboard/analyze">
              <Button>Analyze a Website</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
