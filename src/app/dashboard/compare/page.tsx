import { ComparisonTool } from '@/components/analyze/ComparisonTool';

export const metadata = {
  title: 'Compare Websites - Page Speed Analyzer',
  description: 'Compare performance of two websites side-by-side',
};

export default function ComparePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">
          Compare Websites
        </h1>
        <p className="text-muted-foreground mt-2">
          Analyze and compare the performance of two websites side-by-side
        </p>
      </div>

      <ComparisonTool />
    </div>
  );
}
