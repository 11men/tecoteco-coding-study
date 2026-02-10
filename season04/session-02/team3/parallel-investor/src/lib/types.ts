// ============================================
// Parallel Investor - Shared Types
// ============================================

// --- Feature A: Pattern Similarity Engine ---
export interface StockTicker {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  category: "stock" | "coin" | "etf";
}

export interface PatternMatch {
  id: string;
  matchDate: string;
  similarity: number; // 0-100%
  priceAtMatch: number;
  resultAfter7Days: number; // % change
  resultAfter30Days: number; // % change
  resultAfter90Days: number; // % change
  indicators: {
    movingAverage: number;
    rsi: number;
    volume: number;
  };
}

export interface PatternAnalysisResult {
  ticker: StockTicker;
  capturedAt: string;
  matches: PatternMatch[];
  buyScenario: {
    avgReturn7d: number;
    avgReturn30d: number;
    lossRate: number;
  };
  waitScenario: {
    avgReturn7d: number;
    avgReturn30d: number;
    gainRate: number;
    optimalEntryDays: number;
  };
}

// --- Feature B: Shadow Record ---
export type FomoIntensity = 1 | 2 | 3 | 4 | 5;

export interface ShadowRecord {
  id: string;
  ticker: StockTicker;
  priceAtRecord: number;
  intendedAmount: number;
  fomoIntensity: FomoIntensity;
  memo: string;
  createdAt: string;
  result?: ShadowResult;
}

export interface ShadowResult {
  currentPrice: number;
  changePercent: number;
  defendedAmount: number;
  checkedAt: string;
  isDefenseSuccess: boolean;
}

// --- Feature C: JOMO Calculator ---
export interface JomoConversion {
  defendedAmount: number;
  items: JomoItem[];
}

export interface JomoItem {
  name: string;
  emoji: string;
  unitPrice: number;
  quantity: number;
}

// --- Feature D: Patience Leveling ---
export interface UserLevel {
  level: number;
  title: string;
  titleEn: string;
  currentExp: number;
  nextLevelExp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  earnedAt?: string;
  isEarned: boolean;
}

export interface LevelTier {
  level: number;
  title: string;
  titleEn: string;
  requiredExp: number;
}

// --- User ---
export interface UserProfile {
  id: string;
  nickname: string;
  level: UserLevel;
  badges: Badge[];
  totalDefendedAmount: number;
  totalRecords: number;
  defenseSuccessRate: number;
  isPremium: boolean;
  joinedAt: string;
}

// --- Navigation ---
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
}
