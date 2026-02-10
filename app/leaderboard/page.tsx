'use client';

import { useMemo, useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Trophy } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
} from 'recharts';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { SectionTitle } from '@/src/components/SectionTitle';
import { PlatformBadge } from '@/src/components/PlatformBadge';
import { ScoreBar } from '@/src/components/ScoreBar';
import { PageTransition } from '@/src/components/PageTransition';
import { platformScenarioResults } from '@/src/data/mock';
import {
  PLATFORMS,
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  DIMENSION_CONFIG,
  DIMENSIONS,
} from '@/src/data/constants';
import type { Platform, Scenario, DimensionScores } from '@/src/types';
import { cn } from '@/lib/utils';

type SortField = 'overall' | keyof DimensionScores;
type SortDir = 'asc' | 'desc';

interface LeaderboardRow {
  platform: Platform;
  overall: number;
  scores: DimensionScores;
}

const SCORE_COLUMNS: { key: SortField; label: string }[] = [
  { key: 'overall', label: 'Overall' },
  { key: 'recall', label: DIMENSION_CONFIG.recall.label },
  { key: 'precision', label: DIMENSION_CONFIG.precision.label },
  { key: 'data_coverage', label: DIMENSION_CONFIG.data_coverage.label },
  { key: 'contact_rate', label: DIMENSION_CONFIG.contact_rate.label },
  { key: 'richness', label: DIMENSION_CONFIG.richness.label },
];

function avgScores(
  items: { overall: number; scores: DimensionScores }[],
): { overall: number; scores: DimensionScores } {
  const n = items.length;
  if (n === 0) {
    return {
      overall: 0,
      scores: { recall: 0, precision: 0, data_coverage: 0, contact_rate: 0, richness: 0, response_time: 0 },
    };
  }
  const overall = Math.round(items.reduce((s, i) => s + i.overall, 0) / n);
  const keys: (keyof DimensionScores)[] = [
    'recall', 'precision', 'data_coverage', 'contact_rate', 'richness', 'response_time',
  ];
  const scores = {} as DimensionScores;
  for (const k of keys) {
    scores[k] = Math.round(items.reduce((s, i) => s + i.scores[k], 0) / n);
  }
  return { overall, scores };
}

function getScore(row: LeaderboardRow, field: SortField): number {
  return field === 'overall' ? row.overall : row.scores[field];
}

const DISPLAY_DIMENSIONS: (keyof DimensionScores)[] = DIMENSIONS.filter(
  (d) => d !== 'response_time',
);

const dimensionChartConfig: ChartConfig = Object.fromEntries(
  DISPLAY_DIMENSIONS.map((dim) => [
    dim,
    { label: DIMENSION_CONFIG[dim].label, color: 'hsl(var(--chart-1))' },
  ]),
);

const platformChartConfig: ChartConfig = Object.fromEntries(
  PLATFORMS.map((p) => [p, { label: PLATFORM_LABELS[p], color: PLATFORM_COLORS[p] }]),
);

export default function LeaderboardPage() {
  const [scenario, setScenario] = useState<'all' | Scenario>('all');
  const [sortField, setSortField] = useState<SortField>('overall');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [radarPlatforms, setRadarPlatforms] = useState<Platform[]>(['lessie', 'exa', 'dinq']);

  const rows = useMemo<LeaderboardRow[]>(() => {
    const result: LeaderboardRow[] = PLATFORMS.map((platform) => {
      const items = platformScenarioResults.filter(
        (r) => r.platform === platform && (scenario === 'all' || r.scenario === scenario),
      );
      const { overall, scores } = avgScores(items);
      return { platform, overall, scores };
    });

    result.sort((a, b) => {
      const diff = getScore(a, sortField) - getScore(b, sortField);
      return sortDir === 'desc' ? -diff : diff;
    });

    return result;
  }, [scenario, sortField, sortDir]);

  // Bar chart data: one entry per platform, keys are dimension names
  const barData = useMemo(() => {
    return PLATFORMS.map((platform) => {
      const items = platformScenarioResults.filter(
        (r) => r.platform === platform && (scenario === 'all' || r.scenario === scenario),
      );
      const { scores } = avgScores(items);
      const entry: Record<string, string | number> = { platform: PLATFORM_LABELS[platform] };
      for (const dim of DISPLAY_DIMENSIONS) {
        entry[dim] = scores[dim];
      }
      return entry;
    });
  }, [scenario]);

  // Radar chart data: one entry per dimension, keys are platform names
  const radarData = useMemo(() => {
    return DISPLAY_DIMENSIONS.map((dim) => {
      const entry: Record<string, string | number> = { dimension: DIMENSION_CONFIG[dim].label };
      for (const platform of radarPlatforms) {
        const items = platformScenarioResults.filter(
          (r) => r.platform === platform && (scenario === 'all' || r.scenario === scenario),
        );
        const { scores } = avgScores(items);
        entry[platform] = scores[dim];
      }
      return entry;
    });
  }, [scenario, radarPlatforms]);

  function toggleRadarPlatform(platform: Platform) {
    setRadarPlatforms((prev) => {
      if (prev.includes(platform)) {
        if (prev.length <= 1) return prev;
        return prev.filter((p) => p !== platform);
      }
      if (prev.length >= 3) return prev;
      return [...prev, platform];
    });
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <ArrowUpDown className="size-3 text-muted-foreground/50" />;
    }
    return sortDir === 'desc' ? (
      <ArrowDown className="size-3" />
    ) : (
      <ArrowUp className="size-3" />
    );
  }

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle
        title="Leaderboard"
        subtitle="Compare AI people search platforms across multiple dimensions and scenarios."
      />

      {/* Scenario filter */}
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

      {/* Ranking table */}
      <AnimatePresence mode="wait">
      <motion.div
        key={scenario}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="mt-6 overflow-x-auto rounded-lg border border-border/60 bg-card"
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16 text-center">Rank</TableHead>
              <TableHead className="w-32">Platform</TableHead>
              {SCORE_COLUMNS.map(({ key, label }) => (
                <TableHead key={key}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort(key)}
                  >
                    {label}
                    <SortIcon field={key} />
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => {
              const rank = idx + 1;
              const isFirst = rank === 1;

              return (
                <TableRow
                  key={row.platform}
                  className={cn(
                    isFirst &&
                      'bg-yellow-500/[0.04] border-l-2 border-l-yellow-500/60',
                  )}
                >
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        'inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold',
                        isFirst
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : rank === 2
                            ? 'bg-zinc-400/15 text-zinc-400'
                            : rank === 3
                              ? 'bg-amber-700/15 text-amber-600'
                              : 'text-muted-foreground',
                      )}
                    >
                      {isFirst ? (
                        <Trophy className="size-3.5" />
                      ) : (
                        rank
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <PlatformBadge platform={row.platform} />
                  </TableCell>
                  {SCORE_COLUMNS.map(({ key }) => {
                    const score = getScore(row, key);
                    return (
                      <TableCell key={key} className="min-w-[140px]">
                        <ScoreBar
                          score={score}
                          color={
                            key === 'overall'
                              ? PLATFORM_COLORS[row.platform]
                              : undefined
                          }
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
      </AnimatePresence>

      {/* Charts section */}
      <PageTransition delay={0.2} className="mt-10 grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Grouped Bar Chart */}
        <div className="rounded-lg border border-border/60 bg-card p-4">
          <h3 className="mb-4 text-sm font-medium text-foreground">
            Score Breakdown by Platform
          </h3>
          <ChartContainer config={dimensionChartConfig} className="h-[250px] w-full md:h-[350px]">
            <BarChart data={barData} barGap={2} barCategoryGap="20%">
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="platform"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              {DISPLAY_DIMENSIONS.map((dim, i) => {
                const hues = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
                return (
                  <Bar
                    key={dim}
                    dataKey={dim}
                    name={DIMENSION_CONFIG[dim].label}
                    fill={hues[i % hues.length]}
                    radius={[2, 2, 0, 0]}
                  />
                );
              })}
            </BarChart>
          </ChartContainer>
        </div>

        {/* Radar Chart */}
        <div className="rounded-lg border border-border/60 bg-card p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-foreground">
              Platform Comparison
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map((p) => {
                const active = radarPlatforms.includes(p);
                const color = PLATFORM_COLORS[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleRadarPlatform(p)}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-medium transition-all',
                      active
                        ? 'ring-1 ring-offset-1 ring-offset-card'
                        : 'opacity-40 hover:opacity-70',
                    )}
                    style={{
                      backgroundColor: active ? `${color}25` : `${color}10`,
                      color: color,
                      ...(active ? { ringColor: color } : {}),
                    }}
                  >
                    {PLATFORM_LABELS[p]}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Select up to 3 platforms to compare
          </p>
          <ChartContainer config={platformChartConfig} className="h-[250px] w-full md:h-[350px]">
            <RadarChart data={radarData}>
              <PolarGrid strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="dimension"
                fontSize={11}
                tickLine={false}
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              {radarPlatforms.map((p) => (
                <Radar
                  key={p}
                  dataKey={p}
                  name={PLATFORM_LABELS[p]}
                  stroke={PLATFORM_COLORS[p]}
                  fill={PLATFORM_COLORS[p]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
            </RadarChart>
          </ChartContainer>
        </div>
      </PageTransition>
    </PageTransition>
  );
}
