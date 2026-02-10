import {
  Badge,
  PatternAnalysisResult,
  PatternMatch,
  ShadowRecord,
  StockTicker,
  UserProfile,
} from "./types";

// --- Tickers ---
export const MOCK_TICKERS: StockTicker[] = [
  { symbol: "BTC", name: "비트코인", currentPrice: 58320000, changePercent: 3.2, category: "coin" },
  { symbol: "ETH", name: "이더리움", currentPrice: 3180000, changePercent: -1.5, category: "coin" },
  { symbol: "005930", name: "삼성전자", currentPrice: 72400, changePercent: 0.8, category: "stock" },
  { symbol: "NVDA", name: "엔비디아", currentPrice: 142500, changePercent: 5.1, category: "stock" },
  { symbol: "SOL", name: "솔라나", currentPrice: 195000, changePercent: 8.7, category: "coin" },
];

// --- Pattern Matches ---
export const MOCK_PATTERN_MATCHES: PatternMatch[] = [
  {
    id: "pm-1",
    matchDate: "2021-11-10",
    similarity: 92,
    priceAtMatch: 67000000,
    resultAfter7Days: -12.5,
    resultAfter30Days: -25.3,
    resultAfter90Days: -40.1,
    indicators: { movingAverage: 65000000, rsi: 78, volume: 1500000 },
  },
  {
    id: "pm-2",
    matchDate: "2022-03-28",
    similarity: 87,
    priceAtMatch: 48000000,
    resultAfter7Days: -5.2,
    resultAfter30Days: -18.7,
    resultAfter90Days: -30.5,
    indicators: { movingAverage: 45000000, rsi: 72, volume: 1200000 },
  },
  {
    id: "pm-3",
    matchDate: "2020-08-15",
    similarity: 84,
    priceAtMatch: 13500000,
    resultAfter7Days: 2.1,
    resultAfter30Days: -8.3,
    resultAfter90Days: 15.2,
    indicators: { movingAverage: 12800000, rsi: 68, volume: 900000 },
  },
];

export const MOCK_ANALYSIS_RESULT: PatternAnalysisResult = {
  ticker: MOCK_TICKERS[0],
  capturedAt: new Date().toISOString(),
  matches: MOCK_PATTERN_MATCHES,
  buyScenario: {
    avgReturn7d: -5.2,
    avgReturn30d: -17.4,
    lossRate: 67,
  },
  waitScenario: {
    avgReturn7d: 1.8,
    avgReturn30d: 8.5,
    gainRate: 72,
    optimalEntryDays: 15,
  },
};

// --- Shadow Records ---
export const MOCK_SHADOW_RECORDS: ShadowRecord[] = [
  {
    id: "sr-1",
    ticker: MOCK_TICKERS[0],
    priceAtRecord: 61500000,
    intendedAmount: 2000000,
    fomoIntensity: 4,
    memo: "친구가 지금 안 사면 후회한다고 해서...",
    createdAt: "2025-01-15T09:30:00Z",
    result: {
      currentPrice: 58320000,
      changePercent: -5.2,
      defendedAmount: 103000,
      checkedAt: "2025-01-22T09:30:00Z",
      isDefenseSuccess: true,
    },
  },
  {
    id: "sr-2",
    ticker: MOCK_TICKERS[4],
    priceAtRecord: 180000,
    intendedAmount: 1000000,
    fomoIntensity: 5,
    memo: "트위터에서 솔라나 100배 간다고...",
    createdAt: "2025-01-20T14:00:00Z",
    result: {
      currentPrice: 195000,
      changePercent: 8.3,
      defendedAmount: -83000,
      checkedAt: "2025-01-27T14:00:00Z",
      isDefenseSuccess: false,
    },
  },
  {
    id: "sr-3",
    ticker: MOCK_TICKERS[3],
    priceAtRecord: 155000,
    intendedAmount: 3000000,
    fomoIntensity: 3,
    memo: "AI 테마 너무 올라서 지금 안 타면 늦을 것 같다",
    createdAt: "2025-02-01T10:15:00Z",
    result: {
      currentPrice: 142500,
      changePercent: -8.1,
      defendedAmount: 242000,
      checkedAt: "2025-02-08T10:15:00Z",
      isDefenseSuccess: true,
    },
  },
];

// --- Badges ---
export const MOCK_BADGES: Badge[] = [
  {
    id: "b-1",
    name: "첫 참음",
    description: "첫 번째 FOMO를 기록하고 참았습니다",
    icon: "🛡️",
    condition: "첫 FOMO 기록",
    earnedAt: "2025-01-15T09:30:00Z",
    isEarned: true,
  },
  {
    id: "b-2",
    name: "생존자",
    description: "폭락장(-10%+)에서 매매 0회",
    icon: "🏆",
    condition: "폭락장 생존",
    earnedAt: "2025-01-22T00:00:00Z",
    isEarned: true,
  },
  {
    id: "b-3",
    name: "빙쇼트",
    description: "대세 상승장에서 추격매수 없이 버팀",
    icon: "🧊",
    condition: "상승장 버팀",
    isEarned: false,
  },
  {
    id: "b-4",
    name: "해탈 불가",
    description: "미매수 기록한 종목이 실제 상폐",
    icon: "👻",
    condition: "종목 상폐",
    isEarned: false,
  },
];

// --- User Profile ---
export const MOCK_USER: UserProfile = {
  id: "user-1",
  nickname: "철벽투자자",
  level: {
    level: 7,
    title: "철벽",
    titleEn: "Iron Wall",
    currentExp: 180,
    nextLevelExp: 300,
  },
  badges: MOCK_BADGES,
  totalDefendedAmount: 345000,
  totalRecords: 8,
  defenseSuccessRate: 75,
  isPremium: false,
  joinedAt: "2025-01-10T00:00:00Z",
};
