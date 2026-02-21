import { OptimizationTips } from '@/components/optimize/OptimizationTips';

export const metadata = {
  title: 'Optimization Tips - Page Speed Analyzer',
  description: 'Get actionable optimization tips to improve your website performance',
};

export default function OptimizePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">
          Optimization Tips
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse and filter optimization recommendations to improve your website's performance
        </p>
      </div>

      <OptimizationTips />
    </div>
  );
}
