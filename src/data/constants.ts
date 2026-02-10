import type { Platform, Scenario, DimensionScores } from '@/src/types';

export const PLATFORM_COLORS: Record<Platform, string> = {
  lessie: '#3B82F6',
  exa: '#8B5CF6',
  dinq: '#10B981',
  manus: '#F59E0B',
  gpt: '#74AA9C',
  gemini: '#EF4444',
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  lessie: 'Lessie',
  exa: 'EXA',
  dinq: 'DINQ',
  manus: 'Manus',
  gpt: 'GPT',
  gemini: 'Gemini',
};

export const PLATFORMS: Platform[] = ['lessie', 'exa', 'dinq', 'manus', 'gpt', 'gemini'];

export const SCENARIO_CONFIG: Record<Scenario, { label: string; color: string }> = {
  influencer: { label: 'Influencer Discovery', color: '#F472B6' },
  recruitment: { label: 'Recruitment', color: '#60A5FA' },
  lead_gen: { label: 'Lead Generation', color: '#34D399' },
};

export const SCENARIOS: Scenario[] = ['influencer', 'recruitment', 'lead_gen'];

export const DIMENSION_CONFIG: Record<
  keyof DimensionScores,
  { label: string; weight: number; description: string }
> = {
  recall: {
    label: 'Recall',
    weight: 0.20,
    description: 'How many ground-truth people were found',
  },
  precision: {
    label: 'Precision',
    weight: 0.20,
    description: 'How many returned results are truly relevant',
  },
  data_coverage: {
    label: 'Data Coverage',
    weight: 0.15,
    description: 'How many data sources are covered',
  },
  contact_rate: {
    label: 'Contact Rate',
    weight: 0.15,
    description: 'Percentage of results with email or phone',
  },
  richness: {
    label: 'Richness',
    weight: 0.15,
    description: 'Completeness of each person profile',
  },
  response_time: {
    label: 'Response Time',
    weight: 0.15,
    description: 'How fast the search returns results',
  },
};

export const DIMENSIONS: (keyof DimensionScores)[] = [
  'recall',
  'precision',
  'data_coverage',
  'contact_rate',
  'richness',
  'response_time',
];
