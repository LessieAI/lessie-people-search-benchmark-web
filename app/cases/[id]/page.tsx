'use client';

import { useMemo, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, ExternalLink } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, Cell } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { ScenarioTag } from '@/src/components/ScenarioTag';
import { PlatformBadge } from '@/src/components/PlatformBadge';
import { ScoreBar } from '@/src/components/ScoreBar';
import { PageTransition } from '@/src/components/PageTransition';
import { caseDetails } from '@/src/data/mock';
import {
  PLATFORMS,
  PLATFORM_COLORS,
  PLATFORM_LABELS,
} from '@/src/data/constants';
import type { Platform } from '@/src/types';
import { cn } from '@/lib/utils';

const chartConfig: ChartConfig = Object.fromEntries(
  PLATFORMS.map((p) => [p, { label: PLATFORM_LABELS[p], color: PLATFORM_COLORS[p] }]),
);

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const caseData = caseDetails.find((c) => c.id === id);

  const [platformA, setPlatformA] = useState<Platform>('lessie');
  const [platformB, setPlatformB] = useState<Platform>('exa');

  const barData = useMemo(() => {
    if (!caseData) return [];
    return caseData.platform_results
      .map((pr) => {
        const pct =
          caseData.ground_truth_count > 0
            ? Math.round((pr.matched_count / caseData.ground_truth_count) * 100)
            : 0;
        return {
          platform: pr.platform,
          label: PLATFORM_LABELS[pr.platform],
          matchRate: pct,
          fill: PLATFORM_COLORS[pr.platform],
        };
      })
      .sort((a, b) => b.matchRate - a.matchRate);
  }, [caseData]);

  if (!caseData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-muted-foreground">Case not found.</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/cases">
            <ArrowLeft className="mr-1 size-4" />
            Back to Cases
          </Link>
        </Button>
      </div>
    );
  }

  const resultA = caseData.platform_results.find((r) => r.platform === platformA);
  const resultB = caseData.platform_results.find((r) => r.platform === platformB);

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back link */}
      <Button variant="link" asChild className="mb-6 -ml-3 text-muted-foreground">
        <Link href="/cases">
          <ArrowLeft className="mr-1 size-4" />
          Back to Cases
        </Link>
      </Button>

      {/* Top info */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-2">
          <ScenarioTag scenario={caseData.scenario} />
          <Badge variant="secondary">
            {caseData.ground_truth_count} ground truth
          </Badge>
          <p className="basis-full text-sm font-medium leading-relaxed text-foreground sm:basis-auto sm:flex-1">
            {caseData.query}
          </p>
        </CardContent>
      </Card>

      {/* Platform selector */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Platform A:</span>
          <Select value={platformA} onValueChange={(v) => setPlatformA(v as Platform)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((p) => (
                <SelectItem key={p} value={p}>
                  {PLATFORM_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm font-medium text-muted-foreground">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Platform B:</span>
          <Select value={platformB} onValueChange={(v) => setPlatformB(v as Platform)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((p) => (
                <SelectItem key={p} value={p}>
                  {PLATFORM_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {[
          { result: resultA, platform: platformA },
          { result: resultB, platform: platformB },
        ].map(({ result, platform }) => {
          if (!result) return null;
          const matchPct =
            caseData.ground_truth_count > 0
              ? Math.round(
                  (result.matched_count / caseData.ground_truth_count) * 100,
                )
              : 0;

          return (
            <Card key={platform}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <PlatformBadge platform={platform} />
                  <span className="text-sm text-muted-foreground">
                    {result.matched_count}/{result.total_returned} matched
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {matchPct}% recall
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {result.sample_results.map((person) => (
                  <div
                    key={person.name}
                    className={cn(
                      'rounded-md border border-border/60 bg-muted/30 p-3',
                      person.matched_ground_truth &&
                        'border-l-2 border-l-green-500',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {person.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {person.title}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {person.platform_source}
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <Mail
                        className={cn(
                          'size-3.5',
                          person.has_email
                            ? 'text-blue-400'
                            : 'text-muted-foreground/40',
                        )}
                      />
                      <Phone
                        className={cn(
                          'size-3.5',
                          person.has_phone
                            ? 'text-green-400'
                            : 'text-muted-foreground/40',
                        )}
                      />
                      <a
                        href={person.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground/60 hover:text-foreground"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                      <div className="ml-auto w-24">
                        <ScoreBar score={person.relevance_score} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom chart — match rate per platform */}
      <div className="mt-10">
        <h3 className="mb-4 text-sm font-medium text-foreground">
          Match Rate by Platform
        </h3>
        <div className="rounded-lg border border-border/60 bg-card p-4">
          <ChartContainer config={chartConfig} className="h-[200px] w-full md:h-[280px]">
            <BarChart data={barData} barSize={32}>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(v) => `${v}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${value}%`, 'Match Rate']}
                  />
                }
              />
              <Bar dataKey="matchRate" name="Match Rate" radius={[4, 4, 0, 0]}>
                {barData.map((entry) => (
                  <Cell key={entry.platform} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </PageTransition>
  );
}
