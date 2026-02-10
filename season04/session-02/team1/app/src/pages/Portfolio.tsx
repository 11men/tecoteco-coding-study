import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatKRW } from '../utils/format';
import PositionCard from '../components/PositionCard';

export default function Portfolio() {
  const { positions } = useApp();

  const summary = useMemo(() => {
    let totalInvestment = 0;
    let totalCurrentValue = 0;
    let totalProfitLoss = 0;

    positions.forEach((pos) => {
      const isUSD = pos.currency === 'USD';
      const exchangeRate = 1350;

      if (isUSD) {
        totalInvestment += pos.amount * exchangeRate;
        totalCurrentValue += pos.currentPrice * pos.quantity * exchangeRate;
        totalProfitLoss += pos.profitLoss * exchangeRate;
      } else {
        totalInvestment += pos.amount;
        totalCurrentValue += pos.currentPrice * pos.quantity;
        totalProfitLoss += pos.profitLoss;
      }
    });

    const profitRate = totalInvestment > 0
      ? ((totalCurrentValue - totalInvestment) / totalInvestment) * 100
      : 0;

    return {
      totalInvestment,
      totalCurrentValue,
      totalProfitLoss,
      profitRate,
    };
  }, [positions]);

  const isLoss = summary.totalProfitLoss < 0;

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-6">내 포트폴리오</h1>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 border border-gray-700">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-xs mb-1">총 투자금액</p>
            <p className="text-white font-bold text-lg">
              {formatKRW(summary.totalInvestment)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">현재 평가액</p>
            <p className="text-white font-bold text-lg">
              {formatKRW(summary.totalCurrentValue)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <p className="text-gray-500 text-xs mb-1">총 평가손익</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${isLoss ? 'text-red-400' : 'text-blue-400'}`}>
              {summary.totalProfitLoss >= 0 ? '+' : ''}{formatKRW(summary.totalProfitLoss)}
            </p>
            <p className={`text-sm ${isLoss ? 'text-red-400' : 'text-blue-400'}`}>
              ({summary.profitRate >= 0 ? '+' : ''}{summary.profitRate.toFixed(2)}%)
            </p>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {isLoss ? '랭킹에 유리한 손실 중' : '랭킹에 불리한 수익 중'}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-gray-400 text-sm">손실 (랭킹 유리)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <span className="text-gray-400 text-sm">수익 (랭킹 불리)</span>
        </div>
      </div>

      {/* Position List */}
      {positions.length > 0 ? (
        <div className="space-y-4">
          {positions.map((position) => (
            <PositionCard key={position.id} position={position} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl p-8 text-center">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-400 mb-2">아직 포지션이 없습니다</p>
          <p className="text-gray-500 text-sm">벼락 거지가 느껴질 때 기록해보세요</p>
        </div>
      )}
    </div>
  );
}
