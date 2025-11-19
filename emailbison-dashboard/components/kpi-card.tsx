import { Card, Metric, Text, Badge } from '@tremor/react';

export interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  unit?: string;
  description?: string;
  colorClass?: string;
}

export function KPICard({
  title,
  value,
  trend,
  unit = '',
  description,
  colorClass = 'text-blue-500'
}: KPICardProps) {
  // Determine badge color based on trend
  const getBadgeColor = () => {
    if (!trend) return undefined;

    // For some metrics (like bounce rate), negative trends are good
    const isMetricInverted = title.toLowerCase().includes('bounce');
    const effectivelyPositive = isMetricInverted
      ? !trend.isPositive
      : trend.isPositive;

    if (Math.abs(trend.value) < 0.5) return 'gray'; // Neutral
    return effectivelyPositive ? 'green' : 'red';
  };

  return (
    <Card className="max-w-sm">
      <div className="flex items-start justify-between">
        <div>
          <Text className="text-sm font-medium text-gray-600">{title}</Text>
          <Metric className={`mt-2 ${colorClass}`}>
            {typeof value === 'number' ? value.toFixed(1) : value}
            {unit && <span className="text-base ml-1">{unit}</span>}
          </Metric>
        </div>
        {trend && (
          <Badge color={getBadgeColor()} size="sm">
            {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
          </Badge>
        )}
      </div>
      {description && (
        <Text className="mt-2 text-xs text-gray-500">{description}</Text>
      )}
    </Card>
  );
}
