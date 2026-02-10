import type {
  Platform,
  Scenario,
  PlatformScenarioResult,
  CaseDetail,
  DataSourceCoverage,
  JudgeConsensus,
  DimensionScores,
} from '@/src/types';
import { DIMENSIONS } from './constants';

// ─── Platform × Scenario scores ────────────────────────────────────────────
// Rows: platform, scenario, recall, precision, data_coverage, contact_rate, richness, response_time, overall, rank, result_count, avg_response_time_ms

type ScoreRow = [
  Platform, Scenario,
  number, number, number, number, number, number,
  number, number, number, number,
];

const RAW: ScoreRow[] = [
  // ── Influencer Discovery ──────────────────────────────────────────────
  ['lessie',  'influencer', 90, 88, 92, 85, 89, 78, 88, 1, 48, 3200],
  ['exa',     'influencer', 78, 80, 75, 68, 74, 82, 77, 2, 35, 2800],
  ['dinq',    'influencer', 72, 74, 70, 65, 71, 75, 72, 4, 30, 4100],
  ['manus',   'influencer', 75, 76, 68, 62, 73, 70, 73, 3, 32, 5500],
  ['gpt',     'influencer', 70, 72, 60, 55, 68, 92, 69, 5, 25, 1200],
  ['gemini',  'influencer', 66, 68, 58, 52, 65, 88, 66, 6, 22, 1800],

  // ── Recruitment ───────────────────────────────────────────────────────
  ['lessie',  'recruitment', 92, 86, 90, 88, 91, 75, 89, 1, 52, 3500],
  ['exa',     'recruitment', 80, 82, 78, 72, 76, 80, 79, 2, 40, 2600],
  ['dinq',    'recruitment', 76, 78, 73, 70, 72, 72, 74, 3, 36, 4300],
  ['manus',   'recruitment', 74, 75, 65, 60, 70, 68, 70, 5, 28, 5800],
  ['gpt',     'recruitment', 72, 74, 62, 58, 66, 94, 72, 4, 26, 1100],
  ['gemini',  'recruitment', 68, 70, 60, 54, 64, 90, 68, 6, 24, 1600],

  // ── Lead Generation ───────────────────────────────────────────────────
  ['lessie',  'lead_gen', 88, 90, 94, 92, 87, 80, 90, 1, 55, 3000],
  ['exa',     'lead_gen', 82, 84, 80, 74, 78, 84, 81, 2, 42, 2400],
  ['dinq',    'lead_gen', 78, 76, 74, 72, 75, 74, 76, 3, 38, 3900],
  ['manus',   'lead_gen', 76, 78, 70, 66, 74, 72, 74, 4, 34, 5200],
  ['gpt',     'lead_gen', 70, 73, 64, 60, 68, 95, 72, 5, 28, 1000],
  ['gemini',  'lead_gen', 65, 70, 60, 56, 64, 90, 68, 6, 25, 1500],
];

export const platformScenarioResults: PlatformScenarioResult[] = RAW.map(
  ([platform, scenario, recall, precision, data_coverage, contact_rate, richness, response_time, overall, rank, result_count, avg_response_time_ms]) => ({
    platform,
    scenario,
    scores: { recall, precision, data_coverage, contact_rate, richness, response_time },
    overall,
    rank,
    result_count,
    avg_response_time_ms,
  }),
);

// ─── Case Details (6 cases, 2 per scenario) ────────────────────────────────

export const caseDetails: CaseDetail[] = [
  // Influencer #1
  {
    id: 'inf-001',
    query: 'Find TikTok beauty influencers with 100K+ followers in the US',
    scenario: 'influencer',
    ground_truth_count: 30,
    platform_results: [
      {
        platform: 'lessie', matched_count: 27, total_returned: 48,
        sample_results: [
          { name: 'Mikayla Nogueira', title: 'Beauty Creator', platform_source: 'TikTok', profile_url: 'https://tiktok.com/@mikaylanogueira', has_email: true, has_phone: false, relevance_score: 96, matched_ground_truth: true },
          { name: 'Alix Earle', title: 'Lifestyle & Beauty', platform_source: 'TikTok', profile_url: 'https://tiktok.com/@alixearle', has_email: true, has_phone: true, relevance_score: 94, matched_ground_truth: true },
          { name: 'NikkieTutorials', title: 'Beauty & Makeup Artist', platform_source: 'TikTok', profile_url: 'https://tiktok.com/@nikkietutorials', has_email: true, has_phone: false, relevance_score: 91, matched_ground_truth: true },
        ],
      },
      {
        platform: 'exa', matched_count: 22, total_returned: 35,
        sample_results: [
          { name: 'Mikayla Nogueira', title: 'Beauty Creator', platform_source: 'TikTok', profile_url: 'https://tiktok.com/@mikaylanogueira', has_email: true, has_phone: false, relevance_score: 92, matched_ground_truth: true },
          { name: 'James Charles', title: 'Makeup Artist', platform_source: 'TikTok', profile_url: 'https://tiktok.com/@jamescharles', has_email: false, has_phone: false, relevance_score: 85, matched_ground_truth: true },
        ],
      },
      {
        platform: 'dinq', matched_count: 18, total_returned: 30,
        sample_results: [
          { name: 'Alix Earle', title: 'Beauty Influencer', platform_source: 'TikTok', profile_url: 'https://tiktok.com/@alixearle', has_email: false, has_phone: false, relevance_score: 88, matched_ground_truth: true },
        ],
      },
      {
        platform: 'manus', matched_count: 20, total_returned: 32,
        sample_results: [
          { name: 'Mikayla Nogueira', title: 'Content Creator', platform_source: 'TikTok', profile_url: 'https://tiktok.com/@mikaylanogueira', has_email: false, has_phone: false, relevance_score: 86, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gpt', matched_count: 16, total_returned: 25,
        sample_results: [
          { name: 'Charli D\'Amelio', title: 'TikTok Star', platform_source: 'TikTok', profile_url: 'https://tiktok.com/@charlidamelio', has_email: false, has_phone: false, relevance_score: 78, matched_ground_truth: false },
        ],
      },
      {
        platform: 'gemini', matched_count: 14, total_returned: 22,
        sample_results: [
          { name: 'Addison Rae', title: 'Content Creator', platform_source: 'TikTok', profile_url: 'https://tiktok.com/@addisonre', has_email: false, has_phone: false, relevance_score: 74, matched_ground_truth: false },
        ],
      },
    ],
  },
  // Influencer #2
  {
    id: 'inf-002',
    query: 'Find YouTube tech reviewers with high engagement rate',
    scenario: 'influencer',
    ground_truth_count: 25,
    platform_results: [
      {
        platform: 'lessie', matched_count: 23, total_returned: 45,
        sample_results: [
          { name: 'Marques Brownlee', title: 'Tech Reviewer', platform_source: 'YouTube', profile_url: 'https://youtube.com/@mkbhd', has_email: true, has_phone: false, relevance_score: 98, matched_ground_truth: true },
          { name: 'Linus Sebastian', title: 'Linus Tech Tips', platform_source: 'YouTube', profile_url: 'https://youtube.com/@linustechtips', has_email: true, has_phone: false, relevance_score: 95, matched_ground_truth: true },
        ],
      },
      {
        platform: 'exa', matched_count: 19, total_returned: 34,
        sample_results: [
          { name: 'Marques Brownlee', title: 'MKBHD', platform_source: 'YouTube', profile_url: 'https://youtube.com/@mkbhd', has_email: true, has_phone: false, relevance_score: 95, matched_ground_truth: true },
        ],
      },
      {
        platform: 'dinq', matched_count: 16, total_returned: 28,
        sample_results: [
          { name: 'Dave Lee', title: 'Dave2D', platform_source: 'YouTube', profile_url: 'https://youtube.com/@dave2d', has_email: false, has_phone: false, relevance_score: 87, matched_ground_truth: true },
        ],
      },
      {
        platform: 'manus', matched_count: 17, total_returned: 30,
        sample_results: [
          { name: 'iJustine', title: 'Tech Creator', platform_source: 'YouTube', profile_url: 'https://youtube.com/@ijustine', has_email: false, has_phone: false, relevance_score: 82, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gpt', matched_count: 15, total_returned: 24,
        sample_results: [
          { name: 'Marques Brownlee', title: 'YouTuber', platform_source: 'YouTube', profile_url: 'https://youtube.com/@mkbhd', has_email: false, has_phone: false, relevance_score: 90, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gemini', matched_count: 13, total_returned: 20,
        sample_results: [
          { name: 'Unbox Therapy', title: 'Tech Channel', platform_source: 'YouTube', profile_url: 'https://youtube.com/@unboxtherapy', has_email: false, has_phone: false, relevance_score: 76, matched_ground_truth: true },
        ],
      },
    ],
  },
  // Recruitment #1
  {
    id: 'rec-001',
    query: 'Find senior ML engineers who worked at FAANG companies',
    scenario: 'recruitment',
    ground_truth_count: 35,
    platform_results: [
      {
        platform: 'lessie', matched_count: 32, total_returned: 52,
        sample_results: [
          { name: 'Sarah Chen', title: 'Staff ML Engineer, ex-Google', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/sarah-chen-ml', has_email: true, has_phone: true, relevance_score: 97, matched_ground_truth: true },
          { name: 'James Park', title: 'Senior ML Engineer, ex-Meta', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/james-park-ai', has_email: true, has_phone: false, relevance_score: 94, matched_ground_truth: true },
          { name: 'Priya Sharma', title: 'ML Lead, ex-Apple', platform_source: 'GitHub', profile_url: 'https://github.com/priyasharma-ml', has_email: true, has_phone: false, relevance_score: 92, matched_ground_truth: true },
        ],
      },
      {
        platform: 'exa', matched_count: 26, total_returned: 40,
        sample_results: [
          { name: 'Sarah Chen', title: 'ML Engineer', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/sarah-chen-ml', has_email: true, has_phone: false, relevance_score: 93, matched_ground_truth: true },
          { name: 'Alex Kim', title: 'AI Researcher, ex-Amazon', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/alex-kim-ai', has_email: true, has_phone: false, relevance_score: 88, matched_ground_truth: true },
        ],
      },
      {
        platform: 'dinq', matched_count: 24, total_returned: 36,
        sample_results: [
          { name: 'Michael Liu', title: 'Senior Data Scientist, ex-Netflix', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/michael-liu-ds', has_email: false, has_phone: false, relevance_score: 85, matched_ground_truth: true },
        ],
      },
      {
        platform: 'manus', matched_count: 20, total_returned: 28,
        sample_results: [
          { name: 'Emily Zhang', title: 'ML Engineer', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/emily-zhang', has_email: false, has_phone: false, relevance_score: 80, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gpt', matched_count: 22, total_returned: 26,
        sample_results: [
          { name: 'David Wang', title: 'Software Engineer', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/david-wang', has_email: false, has_phone: false, relevance_score: 82, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gemini', matched_count: 19, total_returned: 24,
        sample_results: [
          { name: 'Rachel Lee', title: 'AI Engineer', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/rachel-lee-ai', has_email: false, has_phone: false, relevance_score: 78, matched_ground_truth: true },
        ],
      },
    ],
  },
  // Recruitment #2
  {
    id: 'rec-002',
    query: 'Find Stanford CS graduates working in AI startups',
    scenario: 'recruitment',
    ground_truth_count: 28,
    platform_results: [
      {
        platform: 'lessie', matched_count: 26, total_returned: 50,
        sample_results: [
          { name: 'Andrew Ng (student)', title: 'Co-founder, Landing AI', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/andrew-ng-student', has_email: true, has_phone: false, relevance_score: 96, matched_ground_truth: true },
          { name: 'Lisa Wu', title: 'CTO, AI Startup', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/lisa-wu-ai', has_email: true, has_phone: true, relevance_score: 93, matched_ground_truth: true },
        ],
      },
      {
        platform: 'exa', matched_count: 21, total_returned: 38,
        sample_results: [
          { name: 'Chris Ré', title: 'Stanford Professor / Startup Advisor', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/chris-re', has_email: true, has_phone: false, relevance_score: 90, matched_ground_truth: true },
        ],
      },
      {
        platform: 'dinq', matched_count: 18, total_returned: 34,
        sample_results: [
          { name: 'Tom Brown', title: 'Research Scientist', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/tom-brown-cs', has_email: false, has_phone: false, relevance_score: 84, matched_ground_truth: true },
        ],
      },
      {
        platform: 'manus', matched_count: 16, total_returned: 28,
        sample_results: [
          { name: 'Jennifer Lin', title: 'ML Engineer', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/jennifer-lin', has_email: false, has_phone: false, relevance_score: 79, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gpt', matched_count: 17, total_returned: 26,
        sample_results: [
          { name: 'Kevin Xu', title: 'AI Founder', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/kevin-xu-ai', has_email: false, has_phone: false, relevance_score: 81, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gemini', matched_count: 14, total_returned: 22,
        sample_results: [
          { name: 'Amy Zhou', title: 'Data Scientist', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/amy-zhou', has_email: false, has_phone: false, relevance_score: 75, matched_ground_truth: true },
        ],
      },
    ],
  },
  // Lead Gen #1
  {
    id: 'lead-001',
    query: 'Find VP of Marketing at US SaaS companies',
    scenario: 'lead_gen',
    ground_truth_count: 32,
    platform_results: [
      {
        platform: 'lessie', matched_count: 29, total_returned: 55,
        sample_results: [
          { name: 'Karen Mitchell', title: 'VP of Marketing, HubSpot', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/karen-mitchell', has_email: true, has_phone: true, relevance_score: 97, matched_ground_truth: true },
          { name: 'Brian Halligan', title: 'VP Marketing, Drift', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/brian-halligan', has_email: true, has_phone: true, relevance_score: 95, matched_ground_truth: true },
          { name: 'Stephanie Liu', title: 'VP Growth Marketing, Notion', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/stephanie-liu-mkt', has_email: true, has_phone: false, relevance_score: 93, matched_ground_truth: true },
        ],
      },
      {
        platform: 'exa', matched_count: 24, total_returned: 42,
        sample_results: [
          { name: 'Karen Mitchell', title: 'VP Marketing', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/karen-mitchell', has_email: true, has_phone: false, relevance_score: 92, matched_ground_truth: true },
          { name: 'Mark Peterson', title: 'SVP Marketing, Salesforce', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/mark-peterson', has_email: true, has_phone: false, relevance_score: 89, matched_ground_truth: true },
        ],
      },
      {
        platform: 'dinq', matched_count: 22, total_returned: 38,
        sample_results: [
          { name: 'Laura Davis', title: 'VP Marketing, Zendesk', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/laura-davis-mkt', has_email: false, has_phone: false, relevance_score: 86, matched_ground_truth: true },
        ],
      },
      {
        platform: 'manus', matched_count: 20, total_returned: 34,
        sample_results: [
          { name: 'Chris Johnson', title: 'Marketing Director', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/chris-johnson', has_email: false, has_phone: false, relevance_score: 80, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gpt', matched_count: 18, total_returned: 28,
        sample_results: [
          { name: 'Amanda Torres', title: 'VP Marketing', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/amanda-torres', has_email: false, has_phone: false, relevance_score: 83, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gemini', matched_count: 15, total_returned: 25,
        sample_results: [
          { name: 'Robert Kim', title: 'Head of Marketing', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/robert-kim', has_email: false, has_phone: false, relevance_score: 76, matched_ground_truth: true },
        ],
      },
    ],
  },
  // Lead Gen #2
  {
    id: 'lead-002',
    query: 'Find founders of Series A fintech companies',
    scenario: 'lead_gen',
    ground_truth_count: 26,
    platform_results: [
      {
        platform: 'lessie', matched_count: 24, total_returned: 50,
        sample_results: [
          { name: 'Patrick Collison', title: 'CEO & Co-founder, Stripe', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/patrick-collison', has_email: true, has_phone: false, relevance_score: 95, matched_ground_truth: true },
          { name: 'Vlad Tenev', title: 'Co-founder, Robinhood', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/vlad-tenev', has_email: true, has_phone: true, relevance_score: 93, matched_ground_truth: true },
        ],
      },
      {
        platform: 'exa', matched_count: 20, total_returned: 40,
        sample_results: [
          { name: 'Max Levchin', title: 'Founder, Affirm', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/max-levchin', has_email: true, has_phone: false, relevance_score: 90, matched_ground_truth: true },
        ],
      },
      {
        platform: 'dinq', matched_count: 18, total_returned: 36,
        sample_results: [
          { name: 'Jess Lee', title: 'Fintech Founder', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/jess-lee-fin', has_email: false, has_phone: false, relevance_score: 84, matched_ground_truth: true },
        ],
      },
      {
        platform: 'manus', matched_count: 16, total_returned: 32,
        sample_results: [
          { name: 'Sam Bankman', title: 'Fintech Entrepreneur', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/sam-bankman', has_email: false, has_phone: false, relevance_score: 78, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gpt', matched_count: 15, total_returned: 28,
        sample_results: [
          { name: 'Anna Nguyen', title: 'Startup Founder', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/anna-nguyen', has_email: false, has_phone: false, relevance_score: 80, matched_ground_truth: true },
        ],
      },
      {
        platform: 'gemini', matched_count: 12, total_returned: 24,
        sample_results: [
          { name: 'Daniel Park', title: 'Co-founder, Fintech Co', platform_source: 'LinkedIn', profile_url: 'https://linkedin.com/in/daniel-park-fin', has_email: false, has_phone: false, relevance_score: 72, matched_ground_truth: true },
        ],
      },
    ],
  },
];

// ─── Data Source Coverage ───────────────────────────────────────────────────

export const dataSourceCoverages: DataSourceCoverage[] = [
  { platform: 'lessie',  linkedin: 95, youtube: 90, twitter: 85, tiktok: 88, github: 82, reddit: 70, instagram: 86 },
  { platform: 'exa',     linkedin: 88, youtube: 82, twitter: 80, tiktok: 75, github: 78, reddit: 65, instagram: 72 },
  { platform: 'dinq',    linkedin: 85, youtube: 70, twitter: 72, tiktok: 68, github: 65, reddit: 55, instagram: 66 },
  { platform: 'manus',   linkedin: 80, youtube: 65, twitter: 70, tiktok: 60, github: 58, reddit: 50, instagram: 55 },
  { platform: 'gpt',     linkedin: 75, youtube: 72, twitter: 78, tiktok: 55, github: 70, reddit: 68, instagram: 50 },
  { platform: 'gemini',  linkedin: 72, youtube: 70, twitter: 75, tiktok: 50, github: 65, reddit: 62, instagram: 48 },
];

// ─── Judge Consensus (3-model cross-scoring) ────────────────────────────────

function makeConsensus(
  caseId: string,
  platform: Platform,
  dimension: keyof DimensionScores,
  base: number,
): JudgeConsensus {
  const gpt_score = Math.min(100, Math.max(0, base + Math.round((Math.sin(base * 7 + 1) * 3))));
  const claude_score = Math.min(100, Math.max(0, base + Math.round((Math.cos(base * 5 + 2) * 2))));
  const gemini_score = Math.min(100, Math.max(0, base + Math.round((Math.sin(base * 3 + 3) * 2.5))));
  const final_score = Math.round((gpt_score + claude_score + gemini_score) / 3);
  return { case_id: caseId, platform, dimension, scores: { gpt_score, claude_score, gemini_score, final_score } };
}

const CONSENSUS_PLATFORMS: Platform[] = ['lessie', 'exa', 'dinq', 'manus', 'gpt', 'gemini'];
const CONSENSUS_CASES = ['inf-001', 'rec-001', 'lead-001'];

export const judgeConsensusData: JudgeConsensus[] = CONSENSUS_CASES.flatMap((caseId) => {
  const caseDetail = caseDetails.find((c) => c.id === caseId);
  return CONSENSUS_PLATFORMS.flatMap((platform) => {
    const result = platformScenarioResults.find(
      (r) => r.platform === platform && r.scenario === caseDetail?.scenario,
    );
    if (!result) return [];
    return DIMENSIONS.map((dim) => makeConsensus(caseId, platform, dim, result.scores[dim]));
  });
});
