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
import { PageTransition } from '@/src/components/PageTransition';

const PIPELINE_STEPS = [
  { emoji: '📦', title: 'Evaluation Set', desc: '360 real-world queries across 4 scenarios (B2B, Recruiting, Influencer, Deterministic) in JSONL format with difficulty and bucket metadata.' },
  { emoji: '🔍', title: 'Platform Search', desc: 'Run identical queries across all platforms via API, browser automation, or CLI. Results saved as standardized CSV.' },
  { emoji: '🔄', title: 'Data Normalization', desc: 'Platform-specific loaders convert raw results into a unified PersonResult model (name, title, company, location, etc.).' },
  { emoji: '🤖', title: 'LLM-as-Judge', desc: 'Gemini 3 Flash evaluates each person with Tavily web search verification, scoring 4 dimensions independently.' },
  { emoji: '📊', title: 'Aggregation', desc: 'Per-query scores aggregated with Top-25 quality filtering. Summary statistics computed across all queries.' },
  { emoji: '🏆', title: 'Publish Results', desc: 'Rankings, dimension breakdowns, and case studies published on this dashboard with full data transparency.' },
];

const JUDGE_PROMPT = `You are an expert evaluator for a People Search Benchmark.
Your job is to evaluate ONE person returned by a search platform against the original query.

You have access to a web search tool. Use it to VERIFY the person's information before scoring.

## Evaluation process

Step 1 — VERIFY: Search the web to check whether this person exists and whether their
claimed title, company, location, and other details are accurate.

Step 2 — SCORE: After verification, produce scores on the following dimensions.

## Scoring dimensions

### 1. relevance (weight 30%)
Does this person match the search query's intent and criteria?
- 10: Perfect match on all stated and implied criteria
-  7: Good match, minor gap on one secondary criterion
-  4: Partial match, misses a major criterion
-  1: Tangentially related at best
-  0: Completely off-topic

### 2. accuracy (weight 30%)
Is the information about this person factually correct and verifiable?
- 10: All key facts verified via web search
-  7: Most facts check out, one or two minor details unverifiable
-  4: Some facts verified, but significant gaps or inconsistencies
-  1: Mostly unverifiable, possible hallucination
-  0: Confirmed false or fabricated

### 3. information_completeness (weight 20%)
How rich and complete is the person's profile information?

### 4. uniqueness (weight 20%)
How distinctive and non-obvious is this result?`;

const SCORING_DIMENSIONS = [
  { name: 'Relevance', weight: '30%', description: 'How well each returned person matches the search intent and criteria. A person who perfectly fits all stated and implied conditions scores 10/10.' },
  { name: 'Accuracy', weight: '30%', description: 'Whether the person\'s profile information (name, title, company) is factually correct, verified via Tavily web search against external sources.' },
  { name: 'Information Completeness', weight: '20%', description: 'How rich and complete is the person\'s profile — name, title, company, location, bio, contact info, source URL.' },
  { name: 'Uniqueness', weight: '20%', description: 'Discovery value — results beyond obvious, easily-findable profiles. Hard-to-find people score higher.' },
];

const EVAL_SET_STATS = [
  { category: 'B2B Prospecting', count: 125, buckets: 'SME Owners, Executives, Decision Makers, Industry Experts', difficulty: '118 easy, 7 medium' },
  { category: 'Recruiting', count: 150, buckets: 'Engineering, Startup, Design, Marketing, Product, Data Analytics', difficulty: '91 easy, 47 medium, 11 hard' },
  { category: 'Influencer Search', count: 47, buckets: 'Fashion, Tech, Lifestyle, Education, Gaming', difficulty: '46 easy, 1 medium' },
  { category: 'Deterministic', count: 38, buckets: 'Company Executives, Founding Teams, Employees, Product Leaders', difficulty: 'N/A (verifiable answers)' },
];

const PLATFORMS = [
  { name: 'Lessie', method: 'MongoDB data extraction', results: 'Median ~48, range 0-940' },
  { name: 'Exa', method: 'Python SDK API (exa-py)', results: 'Fixed 25 per query' },
  { name: 'Juicebox', method: 'Playwright browser automation + API replay', results: '0-25 per query' },
  { name: 'Claude Code', method: 'CLI (Claude Sonnet 4.6)', results: 'Variable (text report)' },
  { name: 'Manus', method: 'REST API (manus-1.6 agent)', results: 'Variable (text report)' },
];

const FAIRNESS_MEASURES = [
  { measure: 'Same Queries', detail: 'All platforms evaluated on identical 360 queries from the same JSONL evaluation set' },
  { measure: 'Same Judge Model', detail: 'All results scored by the same Gemini 3 Flash Preview model with identical prompts' },
  { measure: 'Blind Evaluation', detail: 'Judge Agent does not know which platform produced each result — scores purely on person data quality' },
  { measure: 'Web Verification', detail: 'Every person is verified via Tavily real-time web search, not relying on LLM memorization' },
  { measure: 'Per-Person Scoring', detail: 'Each person evaluated independently with chain-of-thought reasoning and verification summary' },
  { measure: 'Full Transparency', detail: 'All raw results, per-person scores with reasoning, and evaluation code are open-sourced' },
];

export default function MethodologyPage() {
  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 1. Pipeline */}
      <SectionTitle
        title="Evaluation Pipeline"
        subtitle="A 6-step process designed for transparency and reproducibility."
      />
      <div className="relative mt-8">
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

      {/* 2. Evaluation Set */}
      <SectionTitle
        title="Evaluation Set"
        subtitle="360 real-world queries across 4 commercial scenarios, with difficulty and domain bucket metadata."
        className="mt-20"
      />
      <div className="mt-8 overflow-x-auto rounded-lg border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Queries</TableHead>
              <TableHead>Difficulty Distribution</TableHead>
              <TableHead>Bucket Examples</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EVAL_SET_STATS.map((row) => (
              <TableRow key={row.category}>
                <TableCell className="font-medium">{row.category}</TableCell>
                <TableCell className="text-center font-mono">{row.count}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.difficulty}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.buckets}</TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2 border-border">
              <TableCell className="font-semibold">Total</TableCell>
              <TableCell className="text-center font-mono font-semibold">360</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Languages: 78.1% English, 21.4% Portuguese, 0.6% Spanish. Queries sourced from real user search sessions.
      </p>

      {/* 3. Platforms */}
      <SectionTitle
        title="Evaluated Platforms"
        subtitle="5 platforms evaluated using their native search interfaces."
        className="mt-20"
      />
      <div className="mt-8 overflow-x-auto rounded-lg border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Platform</TableHead>
              <TableHead>Search Method</TableHead>
              <TableHead>Results per Query</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PLATFORMS.map((p) => (
              <TableRow key={p.name}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.method}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.results}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 4. Scoring Dimensions */}
      <SectionTitle
        title="Scoring Dimensions"
        subtitle="Each person result is independently scored on 4 dimensions by the Judge Agent."
        className="mt-20"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {SCORING_DIMENSIONS.map((dim) => (
          <Card key={dim.name}>
            <CardContent className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{dim.name}</span>
                <Badge variant="secondary">{dim.weight}</Badge>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{dim.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <CardContent className="pt-2">
          <p className="text-xs font-medium text-muted-foreground">Weighted Formula (per person)</p>
          <p className="mt-1 font-mono text-sm text-foreground">
            Judge Score = 0.30 &times; Relevance + 0.30 &times; Accuracy + 0.20 &times; Completeness + 0.20 &times; Uniqueness
          </p>
          <p className="mt-2 text-xs font-medium text-muted-foreground">Overall Score (per query)</p>
          <p className="mt-1 font-mono text-sm text-foreground">
            Final = 82.4% &times; Judge Agent Avg + 17.6% &times; Richness Score
          </p>
        </CardContent>
      </Card>

      {/* 5. LLM-as-Judge */}
      <SectionTitle
        title="LLM-as-Judge with Web Verification"
        subtitle="A ReAct Agent that verifies each person via real-time web search before scoring."
        className="mt-20"
      />
      <div className="mt-8 flex flex-wrap gap-2">
        <Badge style={{ backgroundColor: '#3B82F620', color: '#3B82F6', borderColor: '#3B82F640' }}>
          Gemini 3 Flash Preview
        </Badge>
        <Badge style={{ backgroundColor: '#10B98120', color: '#10B981', borderColor: '#10B98140' }}>
          Tavily Search (web verification)
        </Badge>
        <Badge style={{ backgroundColor: '#F59E0B20', color: '#F59E0B', borderColor: '#F59E0B40' }}>
          OpenRouter API
        </Badge>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-border/60 bg-[#0d1117]">
        <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
          <span className="size-2.5 rounded-full bg-red-500/80" />
          <span className="size-2.5 rounded-full bg-yellow-500/80" />
          <span className="size-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-muted-foreground">judge_system_prompt.txt</span>
        </div>
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-green-400/90">
          <code>{JUDGE_PROMPT}</code>
        </pre>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        The Judge Agent operates as a ReAct (Reasoning + Acting) agent: it first uses Tavily web search
        to verify the person&apos;s identity, title, and company against external sources, then produces
        scores with chain-of-thought reasoning. This ensures scores are based on verifiable facts rather
        than LLM memorization. Each evaluation includes a <code className="text-xs bg-muted px-1 py-0.5 rounded">verification_summary</code> documenting
        what was found during web search.
      </p>

      {/* 6. Fairness */}
      <SectionTitle
        title="Fairness & Transparency"
        subtitle="Measures taken to ensure unbiased, reproducible evaluation."
        className="mt-20"
      />
      <div className="mt-8 overflow-x-auto rounded-lg border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-48">Measure</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FAIRNESS_MEASURES.map((row) => (
              <TableRow key={row.measure}>
                <TableCell className="font-medium">{row.measure}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.detail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 7. Reproducibility */}
      <Card className="mt-20">
        <CardContent className="flex flex-col items-center gap-4 pt-2 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Fully Open &amp; Reproducible
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            All evaluation code, query datasets (JSONL), raw search results (CSV), per-person scoring records
            (JSONL with reasoning), and summary reports are open-sourced. Anyone can reproduce the benchmark
            end-to-end or submit their own platform results.
          </p>
          <div className="mt-2 rounded-lg bg-muted/50 p-4 text-left w-full max-w-lg">
            <pre className="text-xs text-muted-foreground leading-relaxed overflow-x-auto">
{`# Clone and run
git clone https://github.com/LessieAI/lessie-people-search-benchmark
cd lessie-people-search-benchmark
uv sync

# Configure API keys
cp .env.example .env  # Add OPENROUTER_API_KEY, TAVILY_API_KEY

# Run evaluation (e.g., Exa platform)
uv run python scripts/run_full_eval.py --platform exa --concurrency 5`}
            </pre>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Button variant="outline" asChild>
              <a href="https://github.com/LessieAI/lessie-people-search-benchmark" target="_blank" rel="noopener noreferrer">
                <Github className="mr-1.5 size-4" />
                Evaluation Engine
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/LessieAI/lessie-people-search-benchmark-web" target="_blank" rel="noopener noreferrer">
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
