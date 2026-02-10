export type Category = 'domestic' | 'overseas' | 'crypto';

export interface User {
  id: string;
  nickname: string;
  virtualBalance: number;
  initialBalance: number;
  totalDeposited: number;
  level: number;
  levelTitle: string;
  totalLoss: number;
  rankScore: number;
  badges: string[];
  joinedAt: string;
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  category: Category;
  buyPrice: number;
  currentPrice: number;
  quantity: number;
  amount: number;
  buyDate: string;
  profitLoss: number;
  profitRate: number;
  currency?: string;
}

export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  currency?: string;
}

export interface StockData {
  domestic: Stock[];
  overseas: Stock[];
  crypto: Stock[];
}

export interface RankingUser {
  rank: number;
  userId: string;
  nickname: string;
  level: number;
  levelTitle: string;
  totalLoss: number;
  virtualBalance: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'monthly' | 'biweekly' | 'weekly';
  startDate: string;
  endDate: string;
  participants: number;
  myRank: number;
  topRankers: {
    rank: number;
    nickname: string;
    totalLoss: number;
  }[];
  prize: string;
}

export interface JomoItem {
  id: string;
  name: string;
  emoji: string;
  unit: string;
  price: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  minLoss: number;
  maxLoss: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}
