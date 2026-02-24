'use client';

import { getLighthouseScoreColor } from '@/constants/metrics';
import { Card } from '@/components/ui/card';

interface ScoreGaugeProps {
  label: string;
  score: number | null;
  maxScore?: number;
}

function getScoreRating(score: number | null): string {
  if (score === null || score === undefined) return 'N/A';
  if (score >= 90) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
}

export function ScoreGauge({ label, score, maxScore = 100 }: ScoreGaugeProps) {
  const displayScore = score ?? 0;
  const percentage = (displayScore / maxScore) * 100;
  const color = score !== null ? getLighthouseScoreColor(score) : '#888888';
  const rating = getScoreRating(score);

  return (
    <Card className="p-8 flex flex-col items-center justify-center h-full">
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        {/* Outer glow effect */}
        {score !== null && (
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-20"
            style={{ backgroundColor: color }}
          />
        )}

        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted dark:text-muted/50"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${(percentage / 100) * 263.89} 263.89`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
          />
        </svg>

        <div className="absolute text-center">
          <div className="text-5xl font-bold" style={{ color }}>
            {score ?? '—'}
          </div>
          <div className="text-xs font-medium text-muted-foreground mt-1">
            {rating}
          </div>
        </div>
      </div>

      <p className="text-sm font-semibold text-foreground text-center mb-1">
        {label}
      </p>
      <div className="w-full bg-muted rounded-lg h-1.5 mt-2">
        <div
          className="h-full rounded-lg transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </Card>
  );
}
