'use client';

import * as motion from 'motion/react-client';
import { Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SectionTitle } from '@/src/components/SectionTitle';
import { PlatformBadge } from '@/src/components/PlatformBadge';
import { PageTransition } from '@/src/components/PageTransition';
import { judgeConsensusData } from '@/src/data/mock';
import { DIMENSION_CONFIG, DIMENSIONS } from '@/src/data/constants';

/* ── static data ───────────────────────────────────────────────────────── */

const PIPELINE_STEPS = [
  { emoji: '📦', title: 'Build Dataset', desc: 'Curate ground-truth people lists with verified profiles for each scenario.' },
  { emoji: '🔍', title: 'Define Queries', desc: 'Write natural-language search queries matching real-world use cases.' },
  { emoji: '⚡', title: 'Platform Execution', desc: 'Run identical queries across all 6 platforms under controlled conditions.' },
  { emoji: '📊', title: 'Export Excel', desc: 'Collect raw search results into standardized Excel format for each platform.' },
  { emoji: '🤖', title: 'LLM-as-Judge', desc: 'GPT-4o, Claude & Gemini independently score results on 6 dimensions.' },
  { emoji: '✅', title: 'Cross Validation', desc: 'Aggregate 3-model scores, compute consensus, and publish final rankings.' },
];

const JUDGE_PROMPT = `You are an expert evaluator for people search results.

Given:
- Search query: "{query}"
- Ground truth list: [{ground_truth_people}]
- Platform result: {platform_result}

Score the result on a 0-100 scale for each dimension:
1. Recall: What fraction of ground-truth people appear in the results?
2. Precision: What fraction of returned results are truly relevant?
3. Data Coverage: How many distinct data sources are represented?
4. Contact Rate: What percentage of results include email or phone?
5. Richness: How complete is each person's profile information?
6. Response Time: Score inversely proportional to latency.

Return JSON: { "recall": N, "precision": N, ... }
Explain your reasoning for each score in <reasoning> tags.`;

const CONSENSUS_SAMPLE = judgeConsensusData.filter(
  (d) => d.case_id === 'inf-001' && d.dimension === 'recall',
);

export default function MethodologyPage() {
  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 1. Evaluation Pipeline */}
      <SectionTitle
        title="Evaluation Pipeline"
        subtitle="A 6-step process designed for transparency and reproducibility."
      />
      <div className="relative mt-8">
        {/* Connector line (desktop) */}
        <div className="absolute left-0 right-0 top-10 z-0 hidden h-px bg-border lg:block" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {PIPELINE_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="relative z-10"
            >
              <Card className="h-full text-center">
                <CardContent className="flex flex-col items-center gap-2 pt-2">
                  <span className="text-2xl">{step.emoji}</span>
                  <p className="text-xs font-semibold text-foreground">{step.title}</p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. Scoring Dimensions */}
      <SectionTitle
        title="Scoring Dimensions"
        subtitle="Each result is evaluated on 6 orthogonal dimensions."
        className="mt-20"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DIMENSIONS.map((dim) => {
          const cfg = DIMENSION_CONFIG[dim];
          return (
            <Card key={dim}>
              <CardContent className="flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {cfg.label}
                  </span>
                  <Badge variant="secondary">{(cfg.weight * 100).toFixed(0)}%</Badge>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {cfg.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="mt-4">
        <CardContent className="pt-2">
          <p className="text-xs font-medium text-muted-foreground">Weighted Formula</p>
          <p className="mt-1 font-mono text-sm text-foreground">
            Overall = 0.20&times;Recall + 0.20&times;Precision + 0.15&times;Coverage
            + 0.15&times;ContactRate + 0.15&times;Richness + 0.15&times;ResponseTime
          </p>
        </CardContent>
      </Card>

      {/* 3. LLM-as-Judge */}
      <SectionTitle
        title="LLM-as-Judge"
        subtitle="Three frontier models independently evaluate every result."
        className="mt-20"
      />
      <div className="mt-8 flex flex-wrap gap-2">
        <Badge style={{ backgroundColor: '#74AA9C20', color: '#74AA9C', borderColor: '#74AA9C40' }}>
          GPT-4o
        </Badge>
        <Badge style={{ backgroundColor: '#8B5CF620', color: '#8B5CF6', borderColor: '#8B5CF640' }}>
          Claude 3.5 Sonnet
        </Badge>
        <Badge style={{ backgroundColor: '#EF444420', color: '#EF4444', borderColor: '#EF444440' }}>
          Gemini 1.5 Pro
        </Badge>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-border/60 bg-[#0d1117]">
        <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
          <span className="size-2.5 rounded-full bg-red-500/80" />
          <span className="size-2.5 rounded-full bg-yellow-500/80" />
          <span className="size-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-muted-foreground">judge_prompt.txt</span>
        </div>
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-green-400/90">
          <code>{JUDGE_PROMPT}</code>
        </pre>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        By using three independent LLMs from different providers (OpenAI, Anthropic, Google),
        we eliminate single-model bias. Each model scores results without seeing the others&apos;
        outputs. The final score is the arithmetic mean of all three, ensuring no single model
        dominates the evaluation. Our analysis shows inter-model correlation coefficients
        consistently above 0.85, confirming high agreement across judges.
      </p>

      {/* 4. Judge Consensus */}
      <SectionTitle
        title="Judge Consensus"
        subtitle="Three-model scoring consistency for a sample case (Influencer Discovery — Recall)."
        className="mt-20"
      />
      <div className="mt-8 overflow-x-auto rounded-lg border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Platform</TableHead>
              <TableHead className="text-center">GPT-4o</TableHead>
              <TableHead className="text-center">Claude</TableHead>
              <TableHead className="text-center">Gemini</TableHead>
              <TableHead className="text-center">Final</TableHead>
              <TableHead className="text-center">Spread</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONSENSUS_SAMPLE.map((row) => {
              const { gpt_score, claude_score, gemini_score, final_score } = row.scores;
              const spread = Math.max(gpt_score, claude_score, gemini_score) -
                Math.min(gpt_score, claude_score, gemini_score);
              return (
                <TableRow key={row.platform}>
                  <TableCell>
                    <PlatformBadge platform={row.platform} />
                  </TableCell>
                  <TableCell className="text-center tabular-nums">{gpt_score}</TableCell>
                  <TableCell className="text-center tabular-nums">{claude_score}</TableCell>
                  <TableCell className="text-center tabular-nums">{gemini_score}</TableCell>
                  <TableCell className="text-center font-semibold tabular-nums">
                    {final_score}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={spread <= 5 ? 'secondary' : 'destructive'}
                      className="tabular-nums"
                    >
                      &plusmn;{spread}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Spread &le; 5 indicates strong consensus between judges. All cases show inter-model
        correlation &gt; 0.85.
      </p>

      {/* 5. Reproducibility */}
      <Card className="mt-20">
        <CardContent className="flex flex-col items-center gap-4 pt-2 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Fully Open &amp; Reproducible
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            All evaluation code, ground-truth datasets, scoring prompts, and raw results
            are open-sourced. Anyone can reproduce our benchmark end-to-end or submit
            their own platform results for evaluation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Github className="mr-1.5 size-4" />
                Benchmark Core
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Github className="mr-1.5 size-4" />
                Web Dashboard
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
