'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ScoreBarProps {
  score: number;
  color?: string;
  className?: string;
}

function getDefaultColor(score: number): string {
  if (score < 40) return '#EF4444';
  if (score <= 70) return '#F59E0B';
  return '#10B981';
}

export function ScoreBar({ score, color, className }: ScoreBarProps) {
  const barColor = color ?? getDefaultColor(score);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(score, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="w-8 text-right text-sm font-medium tabular-nums text-foreground">
        {score}
      </span>
    </div>
  );
}
