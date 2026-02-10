'use client';

import Link from 'next/link';
import { ArrowRight, Github, Search, Upload, Brain, BarChart3 } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, Cell } from 'recharts';
import * as motion from 'motion/react-client';
import { PageTransition } from '@/src/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { NumberTicker } from '@/components/ui/number-ticker';
import { SectionTitle } from '@/src/components/SectionTitle';
import { platformScenarioResults } from '@/src/data/mock';
import {
  PLATFORMS,
  PLATFORM_COLORS,
  PLATFORM_LABELS,
} from '@/src/data/constants';

// Overall average per platform across all scenarios
const overallData = PLATFORMS.map((platform) => {
  const items = platformScenarioResults.filter((r) => r.platform === platform);
  const avg = Math.round(items.reduce((s, i) => s + i.overall, 0) / items.length);
  return { platform, label: PLATFORM_LABELS[platform], overall: avg, fill: PLATFORM_COLORS[platform] };
}).sort((a, b) => b.overall - a.overall);

const chartConfig: ChartConfig = Object.fromEntries(
  PLATFORMS.map((p) => [p, { label: PLATFORM_LABELS[p], color: PLATFORM_COLORS[p] }]),
);

const HIGHLIGHTS = [
  { value: 6, label: 'Platforms', suffix: '' },
  { value: 3, label: 'Scenarios', suffix: '' },
  { value: 150, label: 'Test Cases', suffix: '+' },
  { value: 3, label: 'LLM Judges', suffix: '' },
] as const;

const STEPS = [
  {
    icon: Search,
    title: 'Build Test Set',
    description: 'Curate ground-truth people lists for each scenario with verified profiles.',
  },
  {
    icon: Upload,
    title: 'Execute Search',
    description: 'Run identical queries across all platforms and collect raw results.',
  },
  {
    icon: Brain,
    title: 'LLM Evaluation',
    description: 'GPT-4o, Claude, and Gemini cross-score results on 6 dimensions.',
  },
  {
    icon: BarChart3,
    title: 'Generate Report',
    description: 'Aggregate scores, compute rankings, and publish transparent results.',
  },
] as const;

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background grid + glow */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/8 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <AnimatedGradientText
                colorFrom="#3B82F6"
                colorTo="#8B5CF6"
                speed={1.5}
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                People Search Benchmark
              </AnimatedGradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              An open, reproducible benchmark for evaluating AI-powered people search
              across recruitment, influencer discovery, and lead generation.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/leaderboard">
                  View Leaderboard
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-1 size-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {HIGHLIGHTS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <Card className="text-center">
                <CardContent className="pt-2">
                  <div className="text-3xl font-bold tracking-tight sm:text-4xl">
                    <NumberTicker value={item.value} delay={0.2 + i * 0.15} />
                    {item.suffix && (
                      <span className="text-muted-foreground">{item.suffix}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Ranking */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle
          title="Overall Ranking"
          subtitle="Average scores across all scenarios and dimensions."
        />
        <PageTransition delay={0.2} className="mt-8 rounded-lg border border-border/60 bg-card p-4">
          <ChartContainer config={chartConfig} className="h-[200px] w-full md:h-[300px]">
            <BarChart
              data={overallData}
              layout="vertical"
              margin={{ left: 60, right: 24 }}
              barSize={28}
            >
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                type="category"
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={56}
              />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="overall" name="Overall" radius={[0, 4, 4, 0]}>
                {overallData.map((entry) => (
                  <Cell key={entry.platform} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </PageTransition>
        <div className="mt-4 text-center">
          <Button variant="link" asChild>
            <Link href="/leaderboard">
              See Full Leaderboard
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle
          title="How It Works"
          subtitle="A transparent, reproducible evaluation pipeline."
          className="text-center"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative"
              >
                {/* Arrow connector (desktop only, not on last item) */}
                {i < STEPS.length - 1 && (
                  <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-muted-foreground/40 lg:block">
                    <ArrowRight className="size-4" />
                  </div>
                )}
                <Card className="h-full text-center">
                  <CardContent className="flex flex-col items-center gap-3 pt-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div className="text-sm font-semibold">{step.title}</div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
