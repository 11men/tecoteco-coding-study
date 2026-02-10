import { JOMO_ITEMS, LEVEL_TIERS } from "./constants";
import { JomoConversion, JomoItem, LevelTier } from "./types";

export function formatKRW(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function getLevelTier(level: number): LevelTier {
  const sorted = [...LEVEL_TIERS].sort((a, b) => b.level - a.level);
  return sorted.find((t) => level >= t.level) ?? LEVEL_TIERS[0];
}

export function calculateJomo(defendedAmount: number): JomoConversion {
  const items: JomoItem[] = JOMO_ITEMS.map((item) => ({
    ...item,
    quantity: Math.floor(defendedAmount / item.unitPrice),
  })).filter((item) => item.quantity > 0);

  return { defendedAmount, items };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  return `${months}개월 전`;
}
