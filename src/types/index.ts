export type Platform = 'lessie' | 'exa' | 'dinq' | 'manus' | 'gpt' | 'gemini';

export type Scenario = 'influencer' | 'recruitment' | 'lead_gen';

export interface DimensionScores {
  recall: number;
  precision: number;
  data_coverage: number;
  contact_rate: number;
  richness: number;
  response_time: number;
}

export interface PlatformScenarioResult {
  platform: Platform;
  scenario: Scenario;
  scores: DimensionScores;
  overall: number;
  rank: number;
  result_count: number;
  avg_response_time_ms: number;
}

export interface PersonResult {
  name: string;
  title: string;
  platform_source: string;
  profile_url: string;
  has_email: boolean;
  has_phone: boolean;
  relevance_score: number;
  matched_ground_truth: boolean;
}

export interface CaseDetail {
  id: string;
  query: string;
  scenario: Scenario;
  ground_truth_count: number;
  platform_results: Array<{
    platform: Platform;
    matched_count: number;
    total_returned: number;
    sample_results: PersonResult[];
  }>;
}

export interface JudgeConsensus {
  case_id: string;
  platform: Platform;
  dimension: keyof DimensionScores;
  scores: {
    gpt_score: number;
    claude_score: number;
    gemini_score: number;
    final_score: number;
  };
}

export interface DataSourceCoverage {
  platform: Platform;
  linkedin: number;
  youtube: number;
  twitter: number;
  tiktok: number;
  github: number;
  reddit: number;
  instagram: number;
}
