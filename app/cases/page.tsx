'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SectionTitle } from '@/src/components/SectionTitle';
import { ScenarioTag } from '@/src/components/ScenarioTag';
import { PageTransition } from '@/src/components/PageTransition';
import { caseDetails } from '@/src/data/mock';
import { PLATFORM_COLORS, PLATFORM_LABELS } from '@/src/data/constants';
import type { Scenario } from '@/src/types';

export default function CasesPage() {
  const [scenario, setScenario] = useState<'all' | Scenario>('all');

  const filtered = useMemo(
    () =>
      scenario === 'all'
        ? caseDetails
        : caseDetails.filter((c) => c.scenario === scenario),
    [scenario],
  );

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle
        title="Test Cases"
        subtitle="Explore detailed results for each evaluation query."
      />

      <Tabs
        value={scenario}
        onValueChange={(v) => setScenario(v as 'all' | Scenario)}
        className="mt-8"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="influencer">Influencer Discovery</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="lead_gen">Lead Generation</TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
      <motion.div
        key={scenario}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((c, i) => {
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileHover={{ y: -4 }}
            >
              <Card className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col gap-4 pt-2">
                  <div className="flex items-center justify-between">
                    <ScenarioTag scenario={c.scenario} />
                    <span className="text-xs text-muted-foreground">
                      {c.ground_truth_count} ground truth
                    </span>
                  </div>

                  <p className="text-sm font-medium leading-snug text-foreground">
                    {c.query}
                  </p>

                  {/* Platform hit-rate bars */}
                  <div className="flex flex-col gap-2">
                    {c.platform_results.map((pr) => {
                      const pct =
                        c.ground_truth_count > 0
                          ? Math.round(
                              (pr.matched_count / c.ground_truth_count) * 100,
                            )
                          : 0;
                      const color = PLATFORM_COLORS[pr.platform];
                      return (
                        <div
                          key={pr.platform}
                          className="flex items-center gap-2"
                        >
                          <span className="w-12 shrink-0 text-xs text-muted-foreground">
                            {PLATFORM_LABELS[pr.platform]}
                          </span>
                          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                          <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-auto pt-2">
                    <Link
                      href={`/cases/${c.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      View Detail
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
      </AnimatePresence>
    </PageTransition>
  );
}
