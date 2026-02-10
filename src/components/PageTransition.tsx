'use client';

import * as motion from 'motion/react-client';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PageTransition({ children, className, delay = 0 }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
