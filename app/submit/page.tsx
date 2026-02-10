'use client';

import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
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
import { ScenarioTag } from '@/src/components/ScenarioTag';
import { PLATFORMS, PLATFORM_LABELS } from '@/src/data/constants';
import type { Platform, Scenario } from '@/src/types';

const SCENARIOS: { value: Scenario; label: string }[] = [
  { value: 'influencer', label: 'Influencer' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'lead_gen', label: 'Lead Gen' },
];

const MOCK_HISTORY = [
  { id: '1', date: '2025-01-15 14:32', platform: 'lessie' as Platform, scenario: 'influencer' as Scenario, status: 'completed' as const },
  { id: '2', date: '2025-01-14 09:18', platform: 'exa' as Platform, scenario: 'recruitment' as Scenario, status: 'completed' as const },
  { id: '3', date: '2025-01-13 16:45', platform: 'gpt' as Platform, scenario: 'lead_gen' as Scenario, status: 'evaluating' as const },
  { id: '4', date: '2025-01-12 11:20', platform: 'manus' as Platform, scenario: 'influencer' as Scenario, status: 'completed' as const },
  { id: '5', date: '2025-01-11 08:55', platform: 'dinq' as Platform, scenario: 'recruitment' as Scenario, status: 'evaluating' as const },
];

const TEMPLATE_COLUMNS = [
  { name: 'Name', desc: 'Full name of the person', example: 'Sarah Chen' },
  { name: 'Title', desc: 'Job title or role', example: 'Staff ML Engineer' },
  { name: 'Platform Source', desc: 'Where the profile was found', example: 'LinkedIn' },
  { name: 'Profile URL', desc: 'Link to the profile', example: 'https://linkedin.com/in/...' },
  { name: 'Email', desc: 'Contact email if available', example: 'sarah@example.com' },
  { name: 'Phone', desc: 'Phone number if available', example: '+1-555-0123' },
  { name: 'Description', desc: 'Brief bio or notes', example: 'Ex-Google, 8 YoE in ML' },
];

export default function SubmitPage() {
  const [platform, setPlatform] = useState<string>('lessie');
  const [customPlatform, setCustomPlatform] = useState('');
  const [scenario, setScenario] = useState<Scenario>('influencer');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  function handleSubmit() {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }
    toast.success('Results submitted successfully! Evaluation will begin shortly.', {
      description: `Platform: ${platform === 'other' ? customPlatform : PLATFORM_LABELS[platform as Platform]} · Scenario: ${scenario}`,
    });
    setFile(null);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle
        title="Submit Results"
        subtitle="Upload your search results Excel and get automated LLM-as-Judge evaluation."
      />

      {/* Submit Form */}
      <Card className="mx-auto mt-8 max-w-[640px]">
        <CardContent className="flex flex-col gap-5 pt-2">
          {/* Platform */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Platform</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{PLATFORM_LABELS[p]}</SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {platform === 'other' && (
              <input
                type="text"
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder="Enter platform name"
                className="mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
              />
            )}
          </div>

          {/* Scenario */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Scenario</label>
            <div className="flex gap-2">
              {SCENARIOS.map((s) => (
                <Button
                  key={s.value}
                  type="button"
                  variant={scenario === s.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setScenario(s.value)}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>

          {/* File upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Results File</label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border/60 bg-muted/20 px-6 py-8 transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              {file ? (
                <>
                  <FileSpreadsheet className="size-8 text-green-400" />
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </>
              ) : (
                <>
                  <Upload className="size-8 text-muted-foreground/60" />
                  <p className="text-sm text-muted-foreground">
                    Drag &amp; drop or <span className="font-medium text-primary">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground">.xlsx or .csv, max 10MB</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} className="w-full">
            Submit for Evaluation
          </Button>
        </CardContent>
      </Card>

      {/* Excel Template */}
      <Card className="mx-auto mt-10 max-w-[640px]">
        <CardContent className="flex flex-col gap-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Excel Template</h3>
            <Button variant="outline" size="sm" asChild>
              <a href="#">
                <Download className="mr-1.5 size-3.5" />
                Download Template
              </a>
            </Button>
          </div>
          <div className="rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Column</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TEMPLATE_COLUMNS.map((col) => (
                  <TableRow key={col.name}>
                    <TableCell className="font-medium">{col.name}</TableCell>
                    <TableCell className="text-muted-foreground">{col.desc}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{col.example}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Submission History */}
      <div className="mt-16">
        <SectionTitle
          title="Submission History"
          subtitle="Track the status of your submitted evaluations."
        />
        <div className="mt-8 rounded-lg border border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Scenario</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_HISTORY.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {row.date}
                  </TableCell>
                  <TableCell>
                    <PlatformBadge platform={row.platform} />
                  </TableCell>
                  <TableCell>
                    <ScenarioTag scenario={row.scenario} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={
                        row.status === 'completed'
                          ? { backgroundColor: '#10B98120', color: '#10B981', borderColor: '#10B98140' }
                          : { backgroundColor: '#F59E0B20', color: '#F59E0B', borderColor: '#F59E0B40' }
                      }
                    >
                      {row.status === 'completed' ? 'Completed' : 'Evaluating'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageTransition>
  );
}
