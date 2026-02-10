import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatKRW } from '../utils/format';
import PositionCard from '../components/PositionCard';
import LevelBadge from '../components/LevelBadge';
import Modal from '../components/Modal';
import jomoItemsData from '../data/jomo-items.json';
import type { JomoItem } from '../types';

const CHICKEN_ITEM_ID = 'chicken';

export default function Home() {
  const navigate = useNavigate();
  const { user, positions, rechargeBalance } = useApp();
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [isRecharging, setIsRecharging] = useState(false);

  const recentPositions = positions.slice(-3).reverse();
  const isBalanceLow = user.virtualBalance <= 0;

  const jomoItems = jomoItemsData as JomoItem[];
  const chickenItem = useMemo(
    () => jomoItems.find((item) => item.id === CHICKEN_ITEM_ID),
    [jomoItems]
  );
  const chickenCount = chickenItem ? Math.floor(user.totalLoss / chickenItem.price) : 0;

  const handleRecharge = () => {
    setIsRecharging(true);
    setTimeout(() => {
      rechargeBalance();
      setIsRecharging(false);
      setShowRechargeModal(false);
    }, 2000);
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm">안녕하세요,</p>
          <p className="text-white font-bold text-lg">{user.nickname}님</p>
        </div>
        <LevelBadge level={user.level} title={user.levelTitle} />
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 border border-gray-700">
        <p className="text-gray-400 text-sm mb-2">현재 가상 잔고</p>
        <p
          className={`text-4xl font-bold mb-4 ${
            user.virtualBalance < 0 ? 'text-red-500' : 'text-green-400'
          }`}
        >
          {formatKRW(user.virtualBalance)}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div>
            <p className="text-gray-500 text-xs mb-0.5">랭킹 점수 (누적 손실)</p>
            <p className="text-yellow-400 font-bold text-lg">
              {formatKRW(user.totalLoss)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs mb-0.5">총 충전액</p>
            <p className="text-gray-300">{formatKRW(user.totalDeposited)}</p>
          </div>
        </div>
      </div>

      {/* Low Balance Alert */}
      {isBalanceLow && (
        <button
          onClick={() => setShowRechargeModal(true)}
          className="w-full py-4 mb-6 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 text-yellow-400 font-semibold flex items-center justify-center gap-2 hover:from-yellow-500/30 hover:to-amber-500/30 transition-all"
        >
          <span className="text-xl">📺</span>
          광고 보고 100만원 충전하기
        </button>
      )}

      {/* 벼락 부자 미리보기 - 손실이면 치킨 N마리 */}
      {chickenItem && user.totalLoss > 0 && (
        <button
          onClick={() => navigate('/jomo')}
          className="w-full mb-6 rounded-xl bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-600/30 p-4 text-left hover:from-amber-900/40 hover:to-orange-900/40 transition-all"
        >
          <p className="text-amber-200/90 text-sm mb-1">이 손실이면 이만큼</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{chickenItem.emoji}</span>
            <div>
              <p className="text-white font-bold text-xl">
                {chickenCount.toLocaleString()}
                <span className="text-amber-200/80 text-base font-normal ml-1">{chickenItem.unit}</span>
              </p>
              <p className="text-amber-200/70 text-xs">{chickenItem.name} 살 수 있어요</p>
            </div>
          </div>
          <p className="text-amber-400/80 text-xs mt-2">자세히 보기 →</p>
        </button>
      )}

      {/* Recent Positions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">최근 포지션</h2>
          <button
            onClick={() => navigate('/portfolio')}
            className="text-gray-400 text-sm hover:text-white transition-colors"
          >
            전체 보기 &rarr;
          </button>
        </div>

        {recentPositions.length > 0 ? (
          <div className="space-y-3">
            {recentPositions.map((position) => (
              <PositionCard key={position.id} position={position} compact />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-4">아직 기록된 포지션이 없습니다</p>
            <button
              onClick={() => navigate('/record/new')}
              className="text-red-400 font-medium hover:text-red-300"
            >
              첫 벼락 거지 기록하기 &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/jomo')}
          className="bg-gray-800/50 rounded-xl p-4 text-left hover:bg-gray-800 transition-colors border border-gray-700/50"
        >
          <span className="text-2xl mb-2 block">🧮</span>
          <p className="text-white font-medium text-sm">벼락 부자 계산기</p>
          <p className="text-gray-500 text-xs">손실로 뭘 살 수 있었을까?</p>
        </button>
        <button
          onClick={() => navigate('/share')}
          className="bg-gray-800/50 rounded-xl p-4 text-left hover:bg-gray-800 transition-colors border border-gray-700/50"
        >
          <span className="text-2xl mb-2 block">📤</span>
          <p className="text-white font-medium text-sm">결과 공유</p>
          <p className="text-gray-500 text-xs">SNS에 자랑하기</p>
        </button>
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/record/new')}
        className="fixed bottom-24 right-4 max-w-md w-auto bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:from-red-600 hover:to-rose-700 transition-all flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        벼락 거지 기록하기
      </button>

      {/* Recharge Modal */}
      <Modal isOpen={showRechargeModal} onClose={() => !isRecharging && setShowRechargeModal(false)}>
        <div className="bg-gray-800 rounded-2xl p-6 text-center">
          {isRecharging ? (
            <>
              <div className="text-5xl mb-4 animate-pulse">📺</div>
              <h3 className="text-white font-bold text-lg mb-2">광고 시청 중...</h3>
              <p className="text-gray-400 text-sm mb-4">잠시만 기다려주세요</p>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full animate-pulse" style={{ width: '100%' }} />
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-white font-bold text-lg mb-2">광고 보고 충전하기</h3>
              <p className="text-gray-400 text-sm mb-6">
                짧은 광고를 보고<br />
                <span className="text-green-400 font-bold">1,000,000원</span>을 충전하세요!
              </p>
              <button
                onClick={handleRecharge}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-bold hover:from-yellow-400 hover:to-amber-400 transition-all"
              >
                광고 시청하기
              </button>
              <button
                onClick={() => setShowRechargeModal(false)}
                className="w-full py-3 mt-2 text-gray-500 hover:text-gray-300"
              >
                나중에 하기
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
