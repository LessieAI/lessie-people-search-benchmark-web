'use client';

import { useMemo, useState } from 'react';
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
import { Trophy, Users, Search, Clock, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';
import { SectionTitle } from '@/src/components/SectionTitle';
import { PageTransition } from '@/src/components/PageTransition';
import { cn } from '@/lib/utils';
import {
  evaluationData,
  caseStudies,
  EVAL_PLATFORMS,
  EVAL_PLATFORM_LABELS,
  EVAL_PLATFORM_COLORS,
  EVAL_DIMENSIONS,
  EVAL_DIMENSION_LABELS,
  EVAL_DIMENSION_DESCRIPTIONS,
  QUERY_TYPES,
  QUERY_TYPE_LABELS,
  type EvalPlatform,
  type EvalDimension,
  type QueryType,
} from '@/src/data/evaluation-results';

const platformChartConfig: ChartConfig = Object.fromEntries(
  EVAL_PLATFORMS.map((p) => [p, { label: EVAL_PLATFORM_LABELS[p], color: EVAL_PLATFORM_COLORS[p] }]),
);

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

function pctBar(v: number, max: number, color: string) {
  const width = (v / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono w-12 text-right">{pct(v)}</span>
    </div>
  );
}

function bestInRow(vals: number[]): number {
  return Math.max(...vals);
}

function RankBadge({ rank }: { rank: number }) {
  const styles = [
    'bg-yellow-500/20 text-yellow-400 ring-yellow-500/30',
    'bg-zinc-400/15 text-zinc-400 ring-zinc-400/30',
    'bg-amber-700/15 text-amber-600 ring-amber-700/30',
  ];
  return (
    <span className={cn(
      'inline-flex items-center justify-center size-6 rounded-full text-xs font-bold ring-1',
      styles[rank - 1] || 'text-muted-foreground',
    )}>
      {rank === 1 ? <Trophy className="size-3" /> : rank}
    </span>
  );
}

export default function ResultsPage() {
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const rankings = useMemo(() => {
    const sorted = [...EVAL_PLATFORMS].sort(
      (a, b) => evaluationData[b].overall.composite - evaluationData[a].overall.composite,
    );
    return sorted.map((p, i) => ({ platform: p, rank: i + 1, data: evaluationData[p] }));
  }, []);

  const radarData = useMemo(() => {
    return EVAL_DIMENSIONS.map((dim) => {
      const entry: Record<string, string | number> = { dimension: EVAL_DIMENSION_LABELS[dim] };
      for (const p of EVAL_PLATFORMS) {
        entry[p] = +(evaluationData[p].by_dimension[dim] * 100).toFixed(1);
      }
      return entry;
    });
  }, []);

  const queryTypeBarData = useMemo(() => {
    return QUERY_TYPES.map((qt) => {
      const entry: Record<string, string | number> = { queryType: QUERY_TYPE_LABELS[qt] };
      for (const p of EVAL_PLATFORMS) {
        entry[p] = +(evaluationData[p].by_query_type[qt].composite * 100).toFixed(1);
      }
      return entry;
    });
  }, []);

  const [selectedQueryType, setSelectedQueryType] = useState<QueryType | 'all'>('all');

  const queryTypeDimData = useMemo(() => {
    if (selectedQueryType === 'all') return null;
    return EVAL_DIMENSIONS.map((dim) => {
      const entry: Record<string, string | number> = { dimension: EVAL_DIMENSION_LABELS[dim] };
      for (const p of EVAL_PLATFORMS) {
        entry[p] = +(evaluationData[p].by_query_type[selectedQueryType].dimensions[dim] * 100).toFixed(1);
      }
      return entry;
    });
  }, [selectedQueryType]);

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Benchmark Results
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Comprehensive evaluation of AI-powered people search platforms across {evaluationData.lessie.total_queries_original}+ real-world queries,
          scored by Gemini 3 Flash on relevance, accuracy, and uniqueness.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground">
          <span>Gemini 3 Flash Preview</span>
          <span className="text-border">|</span>
          <span>60% Judge + 15% Richness + 25% Coverage</span>
        </div>
      </div>

      {/* Leaderboard Card */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="size-5 text-yellow-500" />
          Overall Rankings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rankings.map(({ platform, rank, data }) => (
            <Card key={platform} className={cn(
              'relative overflow-hidden',
              rank === 1 && 'ring-1 ring-yellow-500/30',
            )}>
              {rank === 1 && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-400" />
              )}
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <RankBadge rank={rank} />
                    <span className="font-semibold" style={{ color: EVAL_PLATFORM_COLORS[platform] }}>
                      {EVAL_PLATFORM_LABELS[platform]}
                    </span>
                  </div>
                  <span className="text-2xl font-bold font-mono">
                    {pct(data.overall.composite)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-muted-foreground mb-3">
                  <div>
                    <div>Judge 60%</div>
                    <div className="font-mono text-xs text-foreground">{pct(data.overall.judge_score)}</div>
                  </div>
                  <div>
                    <div>Rich 15%</div>
                    <div className="font-mono text-xs text-foreground">{pct(data.overall.richness)}</div>
                  </div>
                  <div>
                    <div>Cov 25%</div>
                    <div className="font-mono text-xs text-foreground">{pct(data.overall.coverage)}</div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {EVAL_DIMENSIONS.map((dim) => (
                    <div key={dim}>
                      <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                        <span>{EVAL_DIMENSION_LABELS[dim]}</span>
                      </div>
                      {pctBar(data.by_dimension[dim], 1, EVAL_PLATFORM_COLORS[platform])}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Queries</div>
                    <div className="text-sm font-medium">{data.total_queries}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Persons</div>
                    <div className="text-sm font-medium">{data.total_persons.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Eval Time</div>
                    <div className="text-sm font-medium">{data.timing.total_time_human}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Dimension Comparison */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Dimension Comparison</h2>
        <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Radar Overview</h3>
            <ChartContainer config={platformChartConfig} className="h-[280px] w-full md:h-[340px]">
              <RadarChart data={radarData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="dimension" fontSize={12} tickLine={false} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {EVAL_PLATFORMS.map((p) => (
                  <Radar
                    key={p}
                    dataKey={p}
                    name={EVAL_PLATFORM_LABELS[p]}
                    stroke={EVAL_PLATFORM_COLORS[p]}
                    fill={EVAL_PLATFORM_COLORS[p]}
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                ))}
              </RadarChart>
            </ChartContainer>
          </div>

          <div className="rounded-lg border border-border/60 bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-40">Metric</TableHead>
                  {EVAL_PLATFORMS.map((p) => (
                    <TableHead key={p} className="text-center">
                      <span className="font-semibold" style={{ color: EVAL_PLATFORM_COLORS[p] }}>
                        {EVAL_PLATFORM_LABELS[p]}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {EVAL_DIMENSIONS.map((dim) => {
                  const vals = EVAL_PLATFORMS.map((p) => evaluationData[p].by_dimension[dim]);
                  const max = bestInRow(vals);
                  return (
                    <TableRow key={dim}>
                      <TableCell className="font-medium">{EVAL_DIMENSION_LABELS[dim]}</TableCell>
                      {EVAL_PLATFORMS.map((p, i) => (
                        <TableCell key={p} className="text-center">
                          <span className={cn(
                            'font-mono text-sm',
                            vals[i] === max ? 'font-bold text-green-400' : 'text-muted-foreground',
                          )}>
                            {pct(vals[i])}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
                <TableRow className="border-t-2 border-border">
                  <TableCell className="font-semibold">Judge Score (60%)</TableCell>
                  {EVAL_PLATFORMS.map((p) => {
                    const vals = EVAL_PLATFORMS.map((pp) => evaluationData[pp].overall.judge_score);
                    const max = bestInRow(vals);
                    const v = evaluationData[p].overall.judge_score;
                    return (
                      <TableCell key={p} className="text-center">
                        <span className={cn(
                          'font-mono text-sm',
                          v === max ? 'font-bold text-green-400' : 'text-muted-foreground',
                        )}>
                          {pct(v)}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Richness (15%)</TableCell>
                  {EVAL_PLATFORMS.map((p) => {
                    const vals = EVAL_PLATFORMS.map((pp) => evaluationData[pp].overall.richness);
                    const max = bestInRow(vals);
                    const v = evaluationData[p].overall.richness;
                    return (
                      <TableCell key={p} className="text-center">
                        <span className={cn(
                          'font-mono text-sm',
                          v === max ? 'font-bold text-green-400' : 'text-muted-foreground',
                        )}>
                          {pct(v)}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Coverage (25%)</TableCell>
                  {EVAL_PLATFORMS.map((p) => {
                    const vals = EVAL_PLATFORMS.map((pp) => evaluationData[pp].overall.coverage);
                    const max = bestInRow(vals);
                    const v = evaluationData[p].overall.coverage;
                    return (
                      <TableCell key={p} className="text-center">
                        <span className={cn(
                          'font-mono text-sm',
                          v === max ? 'font-bold text-green-400' : 'text-muted-foreground',
                        )}>
                          {pct(v)}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow className="border-t border-border bg-muted/30">
                  <TableCell className="font-bold">Composite Score</TableCell>
                  {EVAL_PLATFORMS.map((p) => {
                    const vals = EVAL_PLATFORMS.map((pp) => evaluationData[pp].overall.composite);
                    const max = bestInRow(vals);
                    const v = evaluationData[p].overall.composite;
                    return (
                      <TableCell key={p} className="text-center">
                        <span className={cn(
                          'font-mono text-sm font-bold',
                          v === max ? 'text-green-400' : 'text-muted-foreground',
                        )}>
                          {pct(v)}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Total Persons</TableCell>
                  {EVAL_PLATFORMS.map((p) => {
                    const vals = EVAL_PLATFORMS.map((pp) => evaluationData[pp].total_persons);
                    const max = bestInRow(vals);
                    const v = evaluationData[p].total_persons;
                    return (
                      <TableCell key={p} className="text-center">
                        <span className={cn(
                          'font-mono text-sm',
                          v === max ? 'font-bold text-green-400' : 'text-muted-foreground',
                        )}>
                          {v.toLocaleString()}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Performance by Query Type */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Performance by Query Type</h2>
        <div className="rounded-lg border border-border/60 bg-card p-4 mb-6">
          <ChartContainer config={platformChartConfig} className="h-[250px] w-full md:h-[340px]">
            <BarChart data={queryTypeBarData} barCategoryGap="20%">
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="queryType" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {EVAL_PLATFORMS.map((p) => (
                <Bar
                  key={p}
                  dataKey={p}
                  name={EVAL_PLATFORM_LABELS[p]}
                  fill={EVAL_PLATFORM_COLORS[p]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </div>

        {/* Drill-down */}
        <Tabs
          value={selectedQueryType}
          onValueChange={(v) => setSelectedQueryType(v as QueryType | 'all')}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="all">Summary Table</TabsTrigger>
            {QUERY_TYPES.map((qt) => (
              <TabsTrigger key={qt} value={qt}>{QUERY_TYPE_LABELS[qt]}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {selectedQueryType === 'all' ? (
          <div className="rounded-lg border border-border/60 bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Query Type</TableHead>
                  <TableHead className="text-center">Queries</TableHead>
                  {EVAL_PLATFORMS.map((p) => (
                    <TableHead key={p} className="text-center">
                      <span style={{ color: EVAL_PLATFORM_COLORS[p] }}>{EVAL_PLATFORM_LABELS[p]}</span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {QUERY_TYPES.map((qt) => {
                  const vals = EVAL_PLATFORMS.map((p) => evaluationData[p].by_query_type[qt].composite);
                  const max = bestInRow(vals);
                  return (
                    <TableRow key={qt}>
                      <TableCell className="font-medium">{QUERY_TYPE_LABELS[qt]}</TableCell>
                      <TableCell className="text-center text-muted-foreground text-sm">
                        ~{Math.round(EVAL_PLATFORMS.reduce((s, p) => s + evaluationData[p].by_query_type[qt].count, 0) / EVAL_PLATFORMS.length)}
                      </TableCell>
                      {EVAL_PLATFORMS.map((p, i) => (
                        <TableCell key={p} className="text-center">
                          <span className={cn(
                            'font-mono text-sm',
                            vals[i] === max ? 'font-bold text-green-400' : 'text-muted-foreground',
                          )}>
                            {pct(vals[i])}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          queryTypeDimData && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <ChartContainer config={platformChartConfig} className="h-[300px] w-full">
                  <RadarChart data={queryTypeDimData}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="dimension" fontSize={11} tickLine={false} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {EVAL_PLATFORMS.map((p) => (
                      <Radar
                        key={p}
                        dataKey={p}
                        name={EVAL_PLATFORM_LABELS[p]}
                        stroke={EVAL_PLATFORM_COLORS[p]}
                        fill={EVAL_PLATFORM_COLORS[p]}
                        fillOpacity={0.12}
                        strokeWidth={2}
                      />
                    ))}
                  </RadarChart>
                </ChartContainer>
              </div>
              <div className="rounded-lg border border-border/60 bg-card overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Dimension</TableHead>
                      {EVAL_PLATFORMS.map((p) => (
                        <TableHead key={p} className="text-center">
                          <span style={{ color: EVAL_PLATFORM_COLORS[p] }}>{EVAL_PLATFORM_LABELS[p]}</span>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {EVAL_DIMENSIONS.map((dim) => {
                      const vals = EVAL_PLATFORMS.map((p) => evaluationData[p].by_query_type[selectedQueryType as QueryType].dimensions[dim]);
                      const max = bestInRow(vals);
                      return (
                        <TableRow key={dim}>
                          <TableCell className="font-medium">{EVAL_DIMENSION_LABELS[dim]}</TableCell>
                          {EVAL_PLATFORMS.map((p, i) => (
                            <TableCell key={p} className="text-center">
                              <span className={cn(
                                'font-mono text-sm',
                                vals[i] === max ? 'font-bold text-green-400' : 'text-muted-foreground',
                              )}>
                                {pct(vals[i])}
                              </span>
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                    <TableRow className="border-t-2 border-border">
                      <TableCell className="font-semibold">Composite</TableCell>
                      {EVAL_PLATFORMS.map((p) => {
                        const vals = EVAL_PLATFORMS.map((pp) => evaluationData[pp].by_query_type[selectedQueryType as QueryType].composite);
                        const max = bestInRow(vals);
                        const v = evaluationData[p].by_query_type[selectedQueryType as QueryType].composite;
                        return (
                          <TableCell key={p} className="text-center">
                            <span className={cn(
                              'font-mono text-sm font-bold',
                              v === max ? 'text-green-400' : 'text-muted-foreground',
                            )}>
                              {pct(v)}
                            </span>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )
        )}
      </section>

      {/* Case Studies */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-2">Case Studies</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Representative queries with verified person-level results across platforms. Each result was independently verified by the evaluation model.
        </p>
        <div className="space-y-4">
          {caseStudies.map((cs) => {
            const isExpanded = expandedCase === cs.query_id;
            return (
              <div key={cs.query_id} className="rounded-lg border border-border/60 bg-card overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
                  onClick={() => setExpandedCase(isExpanded ? null : cs.query_id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {QUERY_TYPE_LABELS[cs.query_type]}
                      </span>
                      <span className="text-xs text-muted-foreground">{cs.query_id}</span>
                    </div>
                    <p className="text-sm font-medium truncate pr-4">&ldquo;{cs.prompt}&rdquo;</p>
                    <div className="flex items-center gap-4 mt-2">
                      {EVAL_PLATFORMS.filter((p) => cs.platforms[p]).map((p) => {
                        const pd = cs.platforms[p]!;
                        return (
                          <span key={p} className="text-xs">
                            <span className="text-muted-foreground">{EVAL_PLATFORM_LABELS[p]}: </span>
                            <span className="font-mono font-medium" style={{ color: EVAL_PLATFORM_COLORS[p] }}>
                              {pd.num_persons > 0 ? pct(pd.score) : 'N/A'}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              ({pd.num_persons} results)
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="size-4 text-muted-foreground shrink-0" /> : <ChevronDown className="size-4 text-muted-foreground shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-border/40 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {EVAL_PLATFORMS.filter((p) => cs.platforms[p]).map((p) => {
                        const pd = cs.platforms[p]!;
                        const availablePlatforms = EVAL_PLATFORMS.filter((pp) => cs.platforms[pp]);
                        const hasBest = availablePlatforms.every(
                          (pp) => (cs.platforms[pp]?.score ?? 0) <= pd.score,
                        );
                        return (
                          <div
                            key={p}
                            className={cn(
                              'rounded-lg border p-3',
                              hasBest ? 'border-green-500/30 bg-green-500/5' : 'border-border/40',
                            )}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold" style={{ color: EVAL_PLATFORM_COLORS[p] }}>
                                {EVAL_PLATFORM_LABELS[p]}
                              </span>
                              <span className="text-lg font-bold font-mono">
                                {pd.num_persons > 0 ? pct(pd.score) : 'N/A'}
                              </span>
                            </div>
                            {pd.num_persons > 0 ? (
                              <>
                                <div className="text-xs text-muted-foreground mb-2">
                                  {pd.num_persons} persons returned
                                </div>
                                <div className="space-y-1.5 mb-3">
                                  {(['relevance', 'accuracy', 'uniqueness'] as const).map((dim) => (
                                    <div key={dim} className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">{EVAL_DIMENSION_LABELS[dim]}</span>
                                      <span className="font-mono">{pct(pd.dimensions[dim])}</span>
                                    </div>
                                  ))}
                                </div>
                                {pd.good_examples.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-border/30">
                                    <div className="text-xs font-medium text-green-400 flex items-center gap-1 mb-2">
                                      <CheckCircle className="size-3" />
                                      Verified Examples
                                    </div>
                                    {pd.good_examples.map((ex) => (
                                      <div key={ex.name} className="mb-2 last:mb-0">
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-medium truncate mr-2">{ex.name}</span>
                                          <span className="font-mono text-green-400 shrink-0">{ex.score.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                          {ex.verification}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {pd.bad_examples.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-border/30">
                                    <div className="text-xs font-medium text-red-400 flex items-center gap-1 mb-2">
                                      <XCircle className="size-3" />
                                      Failed Examples
                                    </div>
                                    {pd.bad_examples.map((ex) => (
                                      <div key={ex.name} className="mb-2 last:mb-0">
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-medium truncate mr-2">{ex.name}</span>
                                          <span className="font-mono text-red-400 shrink-0">{ex.score.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          {ex.verification || 'Profile could not be verified.'}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-sm text-red-400/80 mt-2">
                                No results returned for this query.
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Methodology */}
      <section className="rounded-lg border border-border/60 bg-card p-6">
        <h2 className="text-sm font-semibold mb-3">Evaluation Methodology</h2>
        <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-1">Scoring Method</h3>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>Top-25 quality scoring: for each query, only the top 25 highest-scoring results are included in the final score</li>
              <li>Queries with zero results are excluded from aggregation to avoid penalizing platforms for coverage gaps</li>
              <li>All platforms evaluated on the same query set (~360 queries across 4 categories)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-1">Evaluation Dimensions</h3>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li><strong>Relevance:</strong> How well each returned person matches the search intent and criteria</li>
              <li><strong>Accuracy:</strong> Whether the person&apos;s profile information (name, title, company) is factually correct</li>
              <li><strong>Uniqueness:</strong> Discovery value -- results beyond obvious, easily-findable profiles</li>
              <li><strong>Result Depth:</strong> Average number of qualified results returned per query (normalized)</li>
              <li><strong>Quality Rate:</strong> Percentage of top-25 results scoring 0.8 or above</li>
              <li><strong>Precision@K:</strong> Percentage of top-25 results with perfect relevance match (1.0)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-1">Judge Model</h3>
            <p className="text-xs">Google Gemini 3 Flash Preview was used as the evaluation judge. Each person result was independently scored with chain-of-thought reasoning and web-verified against external sources.</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-1">Query Categories</h3>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li><strong>B2B Prospecting:</strong> Finding potential business contacts, leads, and decision-makers</li>
              <li><strong>Recruiting:</strong> Sourcing candidates with specific skills, experience, and location</li>
              <li><strong>Influencer Search:</strong> Discovering social media influencers matching niche criteria</li>
              <li><strong>Deterministic:</strong> Finding specific known individuals or employees at companies</li>
            </ul>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
