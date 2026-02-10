import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatKRW } from '../utils/format';
import jomoItemsData from '../data/jomo-items.json';
import type { JomoItem } from '../types';

export default function Jomo() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [lossAmount, setLossAmount] = useState(user.totalLoss);
  const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set());

  const jomoItems = jomoItemsData as JomoItem[];

  useEffect(() => {
    // Animate items one by one
    const itemIds = jomoItems.map((item) => item.id);
    itemIds.forEach((id, index) => {
      setTimeout(() => {
        setAnimatedItems((prev) => new Set([...prev, id]));
      }, index * 150);
    });
  }, [jomoItems]);

  const calculateQuantity = (price: number) => {
    return Math.floor(lossAmount / price);
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-2">벼락 부자 계산기</h1>
      <p className="text-gray-400 text-sm mb-6">
        방어한 손실로 무엇을 살 수 있었을까요?
      </p>

      {/* Loss Amount Input */}
      <div className="bg-gray-800 rounded-xl p-5 mb-6">
        <label className="text-gray-400 text-sm mb-2 block">누적 방어 손실액</label>
        <div className="relative">
          <input
            type="number"
            value={lossAmount}
            onChange={(e) => setLossAmount(Math.max(0, Number(e.target.value)))}
            className="w-full py-3 px-4 rounded-xl bg-gray-700 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
        </div>
        <button
          onClick={() => setLossAmount(user.totalLoss)}
          className="mt-3 text-red-400 text-sm hover:text-red-300 transition-colors"
        >
          내 데이터 불러오기 ({formatKRW(user.totalLoss)})
        </button>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {jomoItems.map((item) => {
          const quantity = calculateQuantity(item.price);
          const isAnimated = animatedItems.has(item.id);

          return (
            <div
              key={item.id}
              className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50 transition-all duration-500 ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <p className="text-gray-400 text-sm mb-1">{item.name}</p>
              <p className="text-white font-bold text-2xl">
                {quantity.toLocaleString()}
                <span className="text-gray-400 text-sm font-normal ml-1">
                  {item.unit}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-xl p-5 border border-red-500/30 mb-6">
        <p className="text-gray-400 text-sm mb-2">이 손실을 방어했다면...</p>
        <div className="flex items-center gap-3">
          <span className="text-4xl">🛡️</span>
          <div>
            <p className="text-red-400 font-bold text-2xl">{formatKRW(lossAmount)}</p>
            <p className="text-gray-400 text-sm">을 지킬 수 있었어요!</p>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={() => navigate('/share')}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        결과 공유하기
      </button>

      {/* Fun Fact */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          치킨 {calculateQuantity(20000)}마리면
        </p>
        <p className="text-gray-400 text-sm">
          매일 1마리씩 {Math.floor(calculateQuantity(20000) / 30)}개월 먹을 수 있어요!
        </p>
      </div>
    </div>
  );
}
