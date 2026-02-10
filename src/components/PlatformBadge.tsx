import type { Platform } from '@/src/types';
import { PLATFORM_LABELS, PLATFORM_COLORS } from '@/src/data/constants';
import { Badge } from '@/components/ui/badge';

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  const color = PLATFORM_COLORS[platform];

  return (
    <Badge
      className={className}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: `${color}40`,
      }}
    >
      {PLATFORM_LABELS[platform]}
    </Badge>
  );
}
