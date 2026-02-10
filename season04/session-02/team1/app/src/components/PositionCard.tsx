import type { Position } from '../types';
import { formatKRW, formatUSD, formatPercent, formatDateShort, getCategoryLabel } from '../utils/format';

interface PositionCardProps {
  position: Position;
  compact?: boolean;
}

export default function PositionCard({ position, compact = false }: PositionCardProps) {
  const isUSD = position.currency === 'USD';
  const formatPrice = isUSD ? formatUSD : formatKRW;

  // In this shadow game, loss is good (red), profit is bad (blue)
  const isLoss = position.profitLoss < 0;
  const profitColor = isLoss ? 'text-red-400' : 'text-blue-400';
  const bgGradient = isLoss ? 'gradient-loss' : 'gradient-profit';

  if (compact) {
    return (
      <div className={`p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 ${bgGradient}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{position.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">
              {getCategoryLabel(position.category)}
            </span>
          </div>
          <span className={`font-bold ${profitColor}`}>
            {formatPercent(position.profitRate)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {position.quantity.toLocaleString('ko-KR')}주 | {formatDateShort(position.buyDate)}
          </span>
          <span className={profitColor}>
            {position.profitLoss >= 0 ? '+' : ''}{isUSD ? formatUSD(position.profitLoss) : formatKRW(position.profitLoss)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 ${bgGradient}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-lg">{position.name}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">
            {getCategoryLabel(position.category)}
          </span>
        </div>
        <span className="text-gray-500 text-sm">{position.symbol}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">매수가</p>
          <p className="text-gray-300">{formatPrice(position.buyPrice)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">현재가</p>
          <p className="text-white font-medium">{formatPrice(position.currentPrice)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">수량</p>
          <p className="text-gray-300">{position.quantity.toLocaleString('ko-KR')}주</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">투자금액</p>
          <p className="text-gray-300">{isUSD ? formatUSD(position.amount) : formatKRW(position.amount)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">매수일</p>
          <p className="text-gray-400 text-sm">{formatDateShort(position.buyDate)}</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${profitColor}`}>
            {formatPercent(position.profitRate)}
          </p>
          <p className={`text-sm ${profitColor}`}>
            {position.profitLoss >= 0 ? '+' : ''}{isUSD ? formatUSD(position.profitLoss) : formatKRW(position.profitLoss)}
          </p>
        </div>
      </div>
    </div>
  );
}
