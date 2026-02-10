/**
 * Format number as Korean Won currency
 */
export function formatKRW(value: number): string {
  return value.toLocaleString('ko-KR') + '원';
}

/**
 * Format number as USD currency
 */
export function formatUSD(value: number): string {
  return '$' + value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format percentage with 2 decimal places
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return sign + value.toFixed(2) + '%';
}

/**
 * Format profit/loss with sign
 */
export function formatProfitLoss(value: number, currency: string = 'KRW'): string {
  const sign = value >= 0 ? '+' : '';
  if (currency === 'USD') {
    return sign + formatUSD(value);
  }
  return sign + formatKRW(value);
}

/**
 * Format date as Korean format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date as short format
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate remaining days until end date
 */
export function getRemainingDays(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get category label in Korean
 */
export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'domestic':
      return '국내주식';
    case 'overseas':
      return '해외주식';
    case 'crypto':
      return '코인';
    default:
      return category;
  }
}
