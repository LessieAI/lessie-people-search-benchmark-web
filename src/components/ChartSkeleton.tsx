import { cn } from '@/lib/utils';

interface ChartSkeletonProps {
  className?: string;
}

export function ChartSkeleton({ className }: ChartSkeletonProps) {
  return (
    <div
      className={cn(
        'flex h-[250px] items-end justify-center gap-3 rounded-lg border border-border/60 bg-card p-6 md:h-[350px]',
        className,
      )}
    >
      {[65, 45, 80, 35, 55, 70].map((h, i) => (
        <div
          key={i}
          className="w-8 animate-pulse rounded-t bg-muted"
          style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
}
