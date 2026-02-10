import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, cols = 6, className }: TableSkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-border/60 bg-card p-4', className)}>
      {/* Header */}
      <div className="mb-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="h-4 flex-1 animate-pulse rounded bg-muted"
          />
        ))}
      </div>
      {/* Rows */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-3 flex-1 animate-pulse rounded bg-muted/70"
                style={{ animationDelay: `${(r * cols + c) * 50}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
