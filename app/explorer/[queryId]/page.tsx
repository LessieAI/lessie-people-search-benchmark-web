'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageTransition } from '@/src/components/PageTransition';
import { cn } from '@/lib/utils';

interface PersonDimension {
  score: number;
  reasoning: string;
}

interface PersonEval {
  idx: number;
  name: string;
  score: number;
  linkedin: string;
  verification: string;
  dimensions: Record<string, PersonDimension>;
}

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
  droid: 'Claude Code',
  manus: 'Manus',
};

const PLATFORM_COLORS: Record<string, string> = {
  lessie: '#3B82F6',
  exa: '#F59E0B',
  juicebox: '#10B981',
  droid: '#8B5CF6',
  manus: '#EF4444',
};

const DIM_LABELS: Record<string, string> = {
  relevance: 'Relevance',
  accuracy: 'Accuracy',
  information_completeness: 'Completeness',
  uniqueness: 'Uniqueness',
};

const QUERY_TYPE_LABELS: Record<string, string> = {
  b2b_prospecting: 'B2B Prospecting',
  recruiting: 'Recruiting',
  influencer_search: 'Influencer Search',
  deterministic: 'Deterministic',
  general: 'General',
};

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

function scoreColor(score: number): string {
  if (score >= 0.8) return 'text-green-400';
  if (score >= 0.6) return 'text-yellow-400';
  if (score >= 0.4) return 'text-orange-400';
  return 'text-red-400';
}

function scoreBg(score: number): string {
  if (score >= 0.8) return 'bg-green-500/10 border-green-500/20';
  if (score >= 0.6) return 'bg-yellow-500/10 border-yellow-500/20';
  if (score >= 0.4) return 'bg-orange-500/10 border-orange-500/20';
  return 'bg-red-500/10 border-red-500/20';
}

function PersonCard({ person, rank }: { person: PersonEval; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn('rounded-lg border p-3', scoreBg(person.score))}>
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-muted-foreground font-mono shrink-0">#{rank}</span>
            <span className="text-sm font-medium truncate">{person.name || '(unknown)'}</span>
            {person.linkedin && (
              <a
                href={person.linkedin.startsWith('http') ? person.linkedin : `https://${person.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn('text-lg font-bold font-mono', scoreColor(person.score))}>
              {person.score.toFixed(2)}
            </span>
            {expanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
          </div>
        </div>

        {/* Dimension scores mini bar */}
        <div className="flex gap-3 mt-2">
          {Object.entries(DIM_LABELS).map(([key, label]) => {
            const dim = person.dimensions[key];
            if (!dim) return null;
            return (
              <div key={key} className="text-xs">
                <span className="text-muted-foreground">{label}: </span>
                <span className={cn('font-mono', scoreColor(dim.score))}>{(dim.score * 10).toFixed(0)}</span>
                <span className="text-muted-foreground">/10</span>
              </div>
            );
          })}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/30 space-y-3">
          {/* Verification */}
          {person.verification && (
            <div>
              <div className="flex items-center gap-1 text-xs font-medium text-green-400 mb-1">
                <CheckCircle className="size-3" />
                Verification Summary
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{person.verification}</p>
            </div>
          )}

          {/* Dimension details */}
          <div className="space-y-2">
            {Object.entries(DIM_LABELS).map(([key, label]) => {
              const dim = person.dimensions[key];
              if (!dim) return null;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-medium">{label}</span>
                    <span className={cn('font-mono font-bold', scoreColor(dim.score))}>
                      {(dim.score * 10).toFixed(0)}/10
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${dim.score * 100}%`,
                        backgroundColor: dim.score >= 0.7 ? '#22c55e' : dim.score >= 0.4 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                  {dim.reasoning && (
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{dim.reasoning}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function QueryDetailPage() {
  const params = useParams();
  const queryId = params.queryId as string;

  const [queryMeta, setQueryMeta] = useState<QueryEntry | null>(null);
  const [persons, setPersons] = useState<Record<string, PersonEval[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('lessie');

  useEffect(() => {
    Promise.all([
      fetch('/data/query-index.json').then((r) => r.json()),
      fetch(`/data/persons/${queryId}.json`).then((r) => {
        if (!r.ok) return null;
        return r.json();
      }),
    ]).then(([index, personData]: [QueryEntry[], Record<string, PersonEval[]> | null]) => {
      const meta = index.find((q) => q.query_id === queryId);
      setQueryMeta(meta || null);
      setPersons(personData);
      if (meta) {
        const availablePlatforms = Object.keys(meta.platforms).filter(
          (p) => meta.platforms[p].num_persons > 0,
        );
        if (availablePlatforms.length > 0 && !availablePlatforms.includes(selectedPlatform)) {
          setSelectedPlatform(availablePlatforms[0]);
        }
      }
      setLoading(false);
    });
  }, [queryId]);

  if (loading) {
    return (
      <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center text-muted-foreground">Loading query details...</div>
      </PageTransition>
    );
  }

  if (!queryMeta) {
    return (
      <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-xl font-bold">Query not found</h1>
          <p className="text-muted-foreground mt-2">No evaluation data for query ID: {queryId}</p>
          <Button variant="outline" asChild className="mt-4">
            <Link href="/explorer"><ArrowLeft className="mr-1 size-4" />Back to Explorer</Link>
          </Button>
        </div>
      </PageTransition>
    );
  }

  const platforms = Object.keys(queryMeta.platforms).filter(
    (p) => p in PLATFORM_LABELS,
  );
  const currentPersons = persons?.[selectedPlatform] || [];
  const currentPlatformData = queryMeta.platforms[selectedPlatform];

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/explorer">
          <ArrowLeft className="mr-1 size-4" />
          Back to Explorer
        </Link>
      </Button>

      {/* Query header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{queryId}</Badge>
          <Badge variant="outline">{QUERY_TYPE_LABELS[queryMeta.query_type] || queryMeta.query_type}</Badge>
          <Badge variant="outline">{queryMeta.language}</Badge>
        </div>
        <h1 className="text-xl font-bold">&ldquo;{queryMeta.prompt}&rdquo;</h1>
      </div>

      {/* Platform summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {platforms.map((p) => {
          const pd = queryMeta.platforms[p];
          const scores = platforms.map((pp) => queryMeta.platforms[pp]?.judge_score ?? 0);
          const maxScore = Math.max(...scores);
          const isBest = pd.judge_score === maxScore && pd.num_persons > 0;
          return (
            <Card
              key={p}
              className={cn(
                'cursor-pointer transition-all',
                selectedPlatform === p && 'ring-1 ring-primary',
                isBest && 'border-green-500/30',
              )}
              onClick={() => setSelectedPlatform(p)}
            >
              {isBest && <div className="h-0.5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-t-lg" />}
              <CardContent className="pt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold" style={{ color: PLATFORM_COLORS[p] }}>
                    {PLATFORM_LABELS[p]}
                  </span>
                  <span className={cn('text-xl font-bold font-mono', pd.num_persons > 0 ? scoreColor(pd.judge_score) : 'text-muted-foreground')}>
                    {pd.num_persons > 0 ? pct(pd.judge_score) : 'N/A'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {pd.num_persons} persons evaluated
                </div>
                {pd.num_persons > 0 && (
                  <div className="space-y-1">
                    {Object.entries(DIM_LABELS).map(([dim, label]) => {
                      const val = pd.dimensions[dim];
                      if (val === undefined) return null;
                      return (
                        <div key={dim} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{label}</span>
                          <span className={cn('font-mono', scoreColor(val))}>{pct(val)}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between text-xs pt-1 border-t border-border/30">
                      <span className="text-muted-foreground">Richness</span>
                      <span className="font-mono text-muted-foreground">{pct(pd.richness)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Platform tabs + person list */}
      <div className="mb-4 flex items-center justify-between">
        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <TabsList>
            {platforms.map((p) => (
              <TabsTrigger key={p} value={p}>
                <span style={{ color: selectedPlatform === p ? PLATFORM_COLORS[p] : undefined }}>
                  {PLATFORM_LABELS[p]}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">
                  ({queryMeta.platforms[p]?.num_persons || 0})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {currentPlatformData && currentPlatformData.num_persons > 0 && (
          <div className="text-xs text-muted-foreground">
            Avg score: <span className={cn('font-mono font-bold', scoreColor(currentPlatformData.judge_score))}>
              {pct(currentPlatformData.judge_score)}
            </span>
          </div>
        )}
      </div>

      {/* Person results */}
      {currentPersons.length === 0 ? (
        <Card>
          <CardContent className="pt-4 text-center">
            <AlertCircle className="size-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {currentPlatformData?.num_persons === 0
                ? 'This platform returned no results for this query.'
                : 'Person-level evaluation data not available for this platform/query combination.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {currentPersons.map((person, i) => (
            <PersonCard key={`${person.idx}-${person.name}`} person={person} rank={i + 1} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}
