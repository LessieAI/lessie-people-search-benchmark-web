'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { PageTransition } from '@/src/components/PageTransition';
import { cn } from '@/lib/utils';

interface QueryPlatformData {
  judge_score: number;
  num_persons: number;
  dimensions: Record<string, number>;
  richness: number;
}

interface QueryEntry {
  query_id: string;
  prompt: string;
  query_type: string;
  language: string;
  platforms: Record<string, QueryPlatformData>;
}

const PLATFORM_LABELS: Record<string, string> = {
  lessie: 'Lessie',
  exa: 'Exa',
  juicebox: 'Juicebox',
};

const PLATFORM_COLORS: Record<string, string> = {
  lessie: '#3B82F6',
  exa: '#F59E0B',
  juicebox: '#10B981',
};

const QUERY_TYPE_LABELS: Record<string, string> = {
  b2b_prospecting: 'B2B',
  recruiting: 'Recruiting',
  influencer_search: 'Influencer',
  deterministic: 'Deterministic',
  general: 'General',
  unknown: 'Unknown',
};

const QUERY_TYPE_COLORS: Record<string, string> = {
  b2b_prospecting: 'bg-blue-500/15 text-blue-400',
  recruiting: 'bg-purple-500/15 text-purple-400',
  influencer_search: 'bg-pink-500/15 text-pink-400',
  deterministic: 'bg-amber-500/15 text-amber-400',
  general: 'bg-zinc-500/15 text-zinc-400',
  unknown: 'bg-zinc-500/15 text-zinc-400',
};

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

function ScorePill({ score, color }: { score: number; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {pct(score)}
    </span>
  );
}

export default function ExplorerPage() {
  const [data, setData] = useState<QueryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [queryType, setQueryType] = useState<string>('all');

  useEffect(() => {
    fetch('/data/query-index.json')
      .then((r) => r.json())
      .then((d: QueryEntry[]) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const queryTypes = useMemo(() => {
    const types = new Set(data.map((q) => q.query_type));
    return ['all', ...Array.from(types).sort()];
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((q) => {
      if (queryType !== 'all' && q.query_type !== queryType) return false;
      if (search && !q.prompt.toLowerCase().includes(search.toLowerCase()) && !q.query_id.includes(search)) return false;
      return true;
    });
  }, [data, queryType, search]);

  const platforms = ['lessie', 'exa', 'juicebox'];

  const stats = useMemo(() => {
    const totalQueries = data.length;
    const totalPersons = data.reduce((sum, q) => {
      return sum + Object.values(q.platforms).reduce((s, p) => s + p.num_persons, 0);
    }, 0);
    const byType = new Map<string, number>();
    data.forEach((q) => byType.set(q.query_type, (byType.get(q.query_type) || 0) + 1));
    return { totalQueries, totalPersons, byType };
  }, [data]);

  if (loading) {
    return (
      <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center text-muted-foreground">Loading evaluation data...</div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Evaluation Explorer</h1>
        <p className="mt-2 text-muted-foreground">
          Browse all {stats.totalQueries} evaluated queries and {stats.totalPersons.toLocaleString()} person-level results across {platforms.length} platforms.
          Click any query to see per-person scoring details.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card>
          <CardContent className="pt-2 text-center">
            <div className="text-2xl font-bold">{stats.totalQueries}</div>
            <div className="text-xs text-muted-foreground">Total Queries</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-2 text-center">
            <div className="text-2xl font-bold">{stats.totalPersons.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Person Evaluations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-2 text-center">
            <div className="text-2xl font-bold">{platforms.length}</div>
            <div className="text-xs text-muted-foreground">Platforms</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-2 text-center">
            <div className="text-2xl font-bold">{stats.byType.size}</div>
            <div className="text-xs text-muted-foreground">Query Types</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by query text or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-card pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <Tabs value={queryType} onValueChange={setQueryType}>
          <TabsList>
            {queryTypes.map((qt) => (
              <TabsTrigger key={qt} value={qt}>
                {qt === 'all' ? `All (${data.length})` : `${QUERY_TYPE_LABELS[qt] || qt} (${stats.byType.get(qt) || 0})`}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Results count */}
      <div className="text-xs text-muted-foreground mb-3">
        Showing {filtered.length} of {data.length} queries
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/60 bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-28">Query ID</TableHead>
              <TableHead className="w-16">Type</TableHead>
              <TableHead>Prompt</TableHead>
              {platforms.map((p) => (
                <TableHead key={p} className="text-center w-28">
                  <span style={{ color: PLATFORM_COLORS[p] }}>{PLATFORM_LABELS[p]}</span>
                </TableHead>
              ))}
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((q) => {
              const scores = platforms.map((p) => q.platforms[p]?.judge_score ?? -1);
              const maxScore = Math.max(...scores.filter((s) => s >= 0));
              return (
                <TableRow key={q.query_id} className="group">
                  <TableCell className="font-mono text-xs">{q.query_id}</TableCell>
                  <TableCell>
                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium', QUERY_TYPE_COLORS[q.query_type] || QUERY_TYPE_COLORS.unknown)}>
                      {QUERY_TYPE_LABELS[q.query_type] || q.query_type}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="text-sm line-clamp-1">{q.prompt}</span>
                  </TableCell>
                  {platforms.map((p) => {
                    const pd = q.platforms[p];
                    if (!pd || pd.num_persons === 0) {
                      return (
                        <TableCell key={p} className="text-center text-xs text-muted-foreground">
                          N/A
                        </TableCell>
                      );
                    }
                    const isBest = pd.judge_score === maxScore;
                    return (
                      <TableCell key={p} className="text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={cn(
                            'font-mono text-xs',
                            isBest ? 'font-bold text-green-400' : 'text-muted-foreground',
                          )}>
                            {pct(pd.judge_score)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {pd.num_persons}p
                          </span>
                        </div>
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Link
                      href={`/explorer/${q.query_id}`}
                      className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="size-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </PageTransition>
  );
}
