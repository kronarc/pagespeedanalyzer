'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RATING_LABELS, Rating } from '@/constants/metrics';

interface VitalCardProps {
  label: string;
  value: number | null;
  unit: string;
  rating: Rating | null;
  icon?: string;
  description?: string;
}

export function VitalCard({
  label,
  value,
  unit,
  rating,
  icon,
  description,
}: VitalCardProps) {
  // Map rating to badge variant
  const getBadgeVariant = (rating: Rating | null) => {
    switch (rating) {
      case 'good':
        return 'good';
      case 'needs-improvement':
        return 'warning';
      case 'poor':
        return 'poor';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="p-6 flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4 flex-1">
          {icon && <span className="text-3xl leading-none">{icon}</span>}
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-foreground leading-tight mb-1">
              {label}
            </h4>
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {rating && (
          <Badge
            variant={getBadgeVariant(rating)}
            className="ml-2 flex-shrink-0"
          >
            {RATING_LABELS[rating]}
          </Badge>
        )}
      </div>

      {value !== null ? (
        <div className="flex items-baseline gap-1">
          <div className="text-3xl font-bold text-foreground">
            {value.toFixed(1)}
          </div>
          <span className="text-sm text-muted-foreground font-medium">{unit}</span>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">No data available</div>
      )}
    </Card>
  );
}
