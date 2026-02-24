export type EvalPlatform = 'lessie' | 'exa' | 'juicebox';

export type QueryType = 'b2b_prospecting' | 'recruiting' | 'influencer_search' | 'deterministic';

export type EvalDimension = 'relevance' | 'accuracy' | 'uniqueness' | 'result_depth' | 'high_quality_rate' | 'precision_at_k';

export interface QueryTypeDimensions {
  relevance: number;
  accuracy: number;
  uniqueness: number;
  result_depth: number;
  high_quality_rate: number;
  precision_at_k: number;
}

export interface PlatformEvalData {
  total_queries: number;
  total_queries_original: number;
  total_persons: number;
  top_k_persons: number;
  model: string;
  timing: { total_time_human: string; avg_seconds_per_person: number };
  overall: { judge_score: number; richness: number };
  by_dimension: QueryTypeDimensions;
  by_query_type: Record<QueryType, {
    count: number;
    avg_score: number;
    dimensions: QueryTypeDimensions;
  }>;
}

export const EVAL_PLATFORMS: EvalPlatform[] = ['lessie', 'exa', 'juicebox'];

export const EVAL_PLATFORM_LABELS: Record<EvalPlatform, string> = {
  lessie: 'Lessie',
  exa: 'Exa',
  juicebox: 'Juicebox',
};

export const EVAL_PLATFORM_COLORS: Record<EvalPlatform, string> = {
  lessie: '#3B82F6',
  exa: '#F59E0B',
  juicebox: '#10B981',
};

export const QUERY_TYPE_LABELS: Record<QueryType, string> = {
  b2b_prospecting: 'B2B Prospecting',
  recruiting: 'Recruiting',
  influencer_search: 'Influencer Search',
  deterministic: 'Deterministic',
};

export const QUERY_TYPES: QueryType[] = ['b2b_prospecting', 'recruiting', 'influencer_search', 'deterministic'];

export const EVAL_DIMENSION_LABELS: Record<EvalDimension, string> = {
  relevance: 'Relevance',
  accuracy: 'Accuracy',
  uniqueness: 'Uniqueness',
  result_depth: 'Result Depth',
  high_quality_rate: 'Quality Rate',
  precision_at_k: 'Precision@K',
};

export const EVAL_DIMENSION_DESCRIPTIONS: Record<EvalDimension, string> = {
  relevance: 'How well each returned person matches the search intent and criteria',
  accuracy: 'Whether the person\'s profile information is factually correct and verifiable',
  uniqueness: 'Discovery value -- results beyond obvious, easily-findable profiles',
  result_depth: 'Average number of qualified results returned per query',
  high_quality_rate: 'Percentage of top results scoring 0.8 or above',
  precision_at_k: 'Percentage of top results with perfect relevance match (score = 1.0)',
};

export const EVAL_DIMENSIONS: EvalDimension[] = [
  'relevance', 'accuracy', 'uniqueness', 'result_depth', 'high_quality_rate', 'precision_at_k',
];

// Result Depth is raw count, needs normalization for radar chart (max ~60)
const DEPTH_NORM = 60;

function normDepth(raw: number): number {
  return Math.min(raw / DEPTH_NORM, 1.0);
}

function makeDims(
  relevance: number, accuracy: number, uniqueness: number,
  result_depth: number, high_quality_rate: number, precision_at_k: number,
): QueryTypeDimensions {
  return { relevance, accuracy, uniqueness, result_depth: normDepth(result_depth), high_quality_rate, precision_at_k };
}

export const evaluationData: Record<EvalPlatform, PlatformEvalData> = {
  lessie: {
    total_queries: 310,
    total_queries_original: 358,
    total_persons: 16319,
    top_k_persons: 6231,
    model: 'google/gemini-3-flash-preview',
    timing: { total_time_human: '10.6h', avg_seconds_per_person: 2.46 },
    overall: { judge_score: 0.8445, richness: 0.8252 },
    by_dimension: makeDims(0.8679, 0.9430, 0.6533, 48.4, 0.8231, 0.6745),
    by_query_type: {
      b2b_prospecting: { count: 109, avg_score: 0.8326, dimensions: makeDims(0.8326, 0.9404, 0.6429, 48.0, 0.7935, 0.6152) },
      recruiting: { count: 127, avg_score: 0.8583, dimensions: makeDims(0.9029, 0.9551, 0.6639, 48.9, 0.8618, 0.7155) },
      influencer_search: { count: 36, avg_score: 0.8661, dimensions: makeDims(0.8894, 0.9851, 0.6887, 59.5, 0.8247, 0.6559) },
      deterministic: { count: 35, avg_score: 0.8275, dimensions: makeDims(0.8394, 0.8692, 0.6143, 38.1, 0.7921, 0.7724) },
    },
  },
  exa: {
    total_queries: 360,
    total_queries_original: 360,
    total_persons: 9000,
    top_k_persons: 9000,
    model: 'google/gemini-3-flash-preview',
    timing: { total_time_human: '4.7h', avg_seconds_per_person: 1.89 },
    overall: { judge_score: 0.7242, richness: 0.8966 },
    by_dimension: makeDims(0.5594, 0.9473, 0.6271, 25.0, 0.4716, 0.2993),
    by_query_type: {
      b2b_prospecting: { count: 132, avg_score: 0.6583, dimensions: makeDims(0.4369, 0.9473, 0.6027, 25.0, 0.3103, 0.1721) },
      recruiting: { count: 136, avg_score: 0.8325, dimensions: makeDims(0.7920, 0.9728, 0.6788, 25.0, 0.7350, 0.5006) },
      influencer_search: { count: 44, avg_score: 0.5564, dimensions: makeDims(0.3578, 0.9425, 0.5691, 25.0, 0.1582, 0.0936) },
      deterministic: { count: 45, avg_score: 0.7541, dimensions: makeDims(0.4109, 0.8763, 0.5975, 25.0, 0.4524, 0.2684) },
    },
  },
  juicebox: {
    total_queries: 352,
    total_queries_original: 360,
    total_persons: 8433,
    top_k_persons: 8333,
    model: 'google/gemini-3-flash-preview',
    timing: { total_time_human: '4.7h', avg_seconds_per_person: 2.03 },
    overall: { judge_score: 0.7300, richness: 0.9534 },
    by_dimension: makeDims(0.5149, 0.9719, 0.6378, 23.7, 0.4558, 0.2922),
    by_query_type: {
      b2b_prospecting: { count: 133, avg_score: 0.6508, dimensions: makeDims(0.3618, 0.9855, 0.6153, 23.7, 0.2600, 0.1368) },
      recruiting: { count: 130, avg_score: 0.8776, dimensions: makeDims(0.8442, 0.9854, 0.6945, 23.9, 0.8129, 0.5673) },
      influencer_search: { count: 42, avg_score: 0.5403, dimensions: makeDims(0.2846, 0.9674, 0.5880, 23.9, 0.1114, 0.0677) },
      deterministic: { count: 45, avg_score: 0.7123, dimensions: makeDims(0.2076, 0.8921, 0.5795, 22.4, 0.3171, 0.1635) },
    },
  },
};

export interface CaseStudyExample {
  name: string;
  score: number;
  verification: string;
}

export interface CaseStudyPlatformData {
  score: number;
  num_persons: number;
  dimensions: { relevance: number; accuracy: number; uniqueness: number };
  richness: number;
  good_examples: CaseStudyExample[];
  bad_examples: CaseStudyExample[];
}

export interface CaseStudy {
  query_id: string;
  prompt: string;
  query_type: QueryType;
  platforms: Record<EvalPlatform, CaseStudyPlatformData>;
}

export const caseStudies: CaseStudy[] = [
  {
    query_id: 'recruiting_0006',
    prompt: 'Looking for product managers in Berlin who have experience in B2C products',
    query_type: 'recruiting',
    platforms: {
      lessie: {
        score: 0.8338, num_persons: 77,
        dimensions: { relevance: 0.8455, accuracy: 0.9857, uniqueness: 0.6688 }, richness: 0.9333,
        good_examples: [
          { name: 'Sina Kasten', score: 0.95, verification: 'Head of Product at igefa E-Commerce GmbH in Berlin. Background includes significant tenure at Zalando (major B2C fashion platform).' },
          { name: 'Sushrut Chafadker', score: 0.95, verification: 'Co-Founder and CPO at topshelf, a B2C social networking and product discovery startup in Berlin.' },
        ],
        bad_examples: [],
      },
      exa: {
        score: 0.9456, num_persons: 25,
        dimensions: { relevance: 0.996, accuracy: 0.988, uniqueness: 0.7 }, richness: 0.844,
        good_examples: [
          { name: 'Boris Buckowitz', score: 0.97, verification: 'Senior Product Manager at CHECK24 in Berlin since 2018, a major German B2C comparison platform.' },
          { name: 'Meggie Bouchard Bergevin', score: 0.97, verification: 'Senior Product Manager II at HelloFresh with previous tenure at Zalando, both major B2C companies.' },
        ],
        bad_examples: [],
      },
      juicebox: {
        score: 0.9164, num_persons: 25,
        dimensions: { relevance: 0.908, accuracy: 0.996, uniqueness: 0.664 }, richness: 0.9774,
        good_examples: [
          { name: 'Franziska Zeiner', score: 0.97, verification: 'Senior Product Manager at DigitalService in Berlin, background in gaming industry B2C products.' },
          { name: 'Galina Charni', score: 0.97, verification: 'Senior Product Manager in Berlin, confirmed tenure at Zalando focusing on B2C customer experiences.' },
        ],
        bad_examples: [],
      },
    },
  },
  {
    query_id: 'b2b_0004',
    prompt: 'Clothing store owners in USA, sustainable fashion, small to medium businesses',
    query_type: 'b2b_prospecting',
    platforms: {
      lessie: {
        score: 0.8345, num_persons: 56,
        dimensions: { relevance: 0.7625, accuracy: 1.0, uniqueness: 0.6946 }, richness: 0.9333,
        good_examples: [
          { name: 'Eyen Duque', score: 0.96, verification: 'Founder/CEO of Arkollab in Houston, TX - luxury resale platform focused on sustainable fashion and circular economy.' },
          { name: 'Paola Zc', score: 0.96, verification: 'Founder/CEO of Zambony Couture in West Palm Beach, FL - boutique fashion brand emphasizing "soul fashion" over fast fashion.' },
        ],
        bad_examples: [],
      },
      exa: {
        score: 0.922, num_persons: 25,
        dimensions: { relevance: 0.916, accuracy: 1.0, uniqueness: 0.74 }, richness: 0.9333,
        good_examples: [
          { name: 'Acadia Herbst', score: 0.97, verification: 'Owner of 111Threads, a small business focused on sustainable fashion and upcycling vintage clothing.' },
          { name: 'Cora Spearman', score: 0.97, verification: 'Founder/CEO of Coradorables in Honolulu, HI - certified B Corporation sustainable fashion brand.' },
        ],
        bad_examples: [],
      },
      juicebox: {
        score: 0.7428, num_persons: 25,
        dimensions: { relevance: 0.52, accuracy: 1.0, uniqueness: 0.692 }, richness: 0.9333,
        good_examples: [
          { name: 'Stephanie Banaszak', score: 0.97, verification: 'Founder of ERTH, a sustainable luxury boutique in La Conner, WA focusing on eco-conscious products.' },
          { name: 'Julian Reed', score: 0.96, verification: 'Owner of Atomic Salvage in Denver, CO - curated vintage and secondhand apparel storefront.' },
        ],
        bad_examples: [],
      },
    },
  },
  {
    query_id: 'influencer_0001',
    prompt: 'Find Brazilian finance/digital marketing influencers on Instagram with 5K-50K followers',
    query_type: 'influencer_search',
    platforms: {
      lessie: {
        score: 0.8312, num_persons: 98,
        dimensions: { relevance: 0.8224, accuracy: 0.9663, uniqueness: 0.6949 }, richness: 0.7649,
        good_examples: [
          { name: 'Maicon Lima', score: 0.94, verification: 'Brazilian financial educator, Instagram @maiconlimainvestidor with ~7.8K followers (within 5K-50K range).' },
          { name: 'Marina Moura (Financas da Gente)', score: 0.94, verification: 'Brazilian financial educator, Instagram @financasdagente with ~13K followers (within 5K-50K range).' },
        ],
        bad_examples: [
          { name: 'Daniel Carlos', score: 0.0, verification: 'Profile could not be verified - evaluation returned zero scores across all dimensions.' },
        ],
      },
      exa: {
        score: 0.5844, num_persons: 25,
        dimensions: { relevance: 0.412, accuracy: 0.884, uniqueness: 0.632 }, richness: 0.92,
        good_examples: [
          { name: 'Israel Pimentel', score: 0.93, verification: 'Brazilian digital influencer @oisraelpimentel focusing on financial education with followers in range.' },
        ],
        bad_examples: [],
      },
      juicebox: {
        score: 0.0, num_persons: 0,
        dimensions: { relevance: 0, accuracy: 0, uniqueness: 0 }, richness: 0,
        good_examples: [],
        bad_examples: [],
      },
    },
  },
  {
    query_id: 'deterministic_0031',
    prompt: 'Find employees at Mistral AI',
    query_type: 'deterministic',
    platforms: {
      lessie: {
        score: 0.9439, num_persons: 80,
        dimensions: { relevance: 0.989, accuracy: 0.98, uniqueness: 0.679 }, richness: 0.9333,
        good_examples: [
          { name: 'Brian Cannon', score: 0.97, verification: 'Verified current employee at Mistral AI, perfectly matching the search query.' },
          { name: 'Sophia Yang', score: 0.97, verification: 'Verified current employee at Mistral AI, Head of Developer Relations.' },
        ],
        bad_examples: [],
      },
      exa: {
        score: 0.798, num_persons: 25,
        dimensions: { relevance: 0.788, accuracy: 0.956, uniqueness: 0.544 }, richness: 0.8666,
        good_examples: [
          { name: 'Nicolas Schuhl', score: 0.97, verification: 'Verified high-level employee at Mistral AI (co-founder).' },
        ],
        bad_examples: [],
      },
      juicebox: {
        score: 0.9292, num_persons: 25,
        dimensions: { relevance: 0.972, accuracy: 0.992, uniqueness: 0.664 }, richness: 0.9333,
        good_examples: [
          { name: 'Soham Ghosh', score: 0.97, verification: 'Verified current employee at Mistral AI.' },
          { name: 'Antoine Charpentier', score: 0.97, verification: 'Verified current employee at Mistral AI.' },
        ],
        bad_examples: [],
      },
    },
  },
];
