import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatKRW } from '../utils/format';

export default function Onboarding() {
  const navigate = useNavigate();
  const { isOnboarded, setOnboarded, setUser } = useApp();
  const STARTING_BALANCE = 1000000;

  const [step, setStep] = useState(1);
  const [showBalance, setShowBalance] = useState(false);
  const [countedBalance, setCountedBalance] = useState(STARTING_BALANCE);

  useEffect(() => {
    if (isOnboarded) {
      navigate('/', { replace: true });
    }
  }, [isOnboarded, navigate]);

  useEffect(() => {
    if (step === 3 && !showBalance) {
      setShowBalance(true);
      setCountedBalance(STARTING_BALANCE);
    }
  }, [step, showBalance]);

  const handleComplete = () => {
    setUser((prev) => ({
      ...prev,
      virtualBalance: STARTING_BALANCE,
      totalDeposited: STARTING_BALANCE,
      totalLoss: 0,
      rankScore: 0,
    }));
    setOnboarded(true);
    navigate('/record/new');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      {step === 1 && (
        <div className="animate-slide-up text-center">
          <div className="text-6xl mb-8">🤯</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            벼락 거지로 주식 산 적 있나요?
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            "지금 안 사면 늦을 것 같아서..."<br />
            "다들 산다길래..."<br />
            "더 오르기 전에 빨리..."
          </p>
          <button
            onClick={() => setStep(2)}
            className="w-full py-4 rounded-xl bg-red-500 text-white font-bold text-lg hover:bg-red-600 transition-colors"
          >
            네, 그래서 손해봤어요
          </button>
          <button
            onClick={() => setStep(2)}
            className="w-full py-4 mt-3 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
          >
            아니요, 근데 관심 있어요
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-slide-up text-center">
          <div className="text-6xl mb-8">💡</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            그 벼락 거지를 기록해보세요
          </h1>
          <p className="text-gray-400 mb-4 leading-relaxed">
            <span className="text-white font-semibold">마이너스의 손</span>은<br />
            충동 매수 충동을 <span className="text-red-400">가상으로 기록</span>하는<br />
            역발상 투자 게임입니다.
          </p>
          <div className="bg-gray-800/50 rounded-xl p-4 mb-8 text-left">
            <p className="text-gray-300 text-sm mb-2">
              <span className="text-red-400">손실</span>이 클수록 높은 랭킹
            </p>
            <p className="text-gray-300 text-sm mb-2">
              <span className="text-blue-400">수익</span>이 나면 랭킹에 불리
            </p>
            <p className="text-gray-300 text-sm">
              진짜 돈은 한 푼도 안 들어요!
            </p>
          </div>
          <button
            onClick={() => setStep(3)}
            className="w-full py-4 rounded-xl bg-red-500 text-white font-bold text-lg hover:bg-red-600 transition-colors"
          >
            재밌네요! 시작할래요
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-slide-up text-center">
          <div className="text-6xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-xl font-bold text-white mb-2">
            가상 잔고가 지급되었습니다!
          </h1>
          <p className="text-gray-400 mb-8">
            이 돈으로 벼락 거지를 마음껏 기록하세요
          </p>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">시작 가상 잔고</p>
            <p className="text-4xl font-bold text-green-400 animate-number-grow">
              {formatKRW(countedBalance)}
            </p>
          </div>
          <button
            onClick={handleComplete}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-lg hover:from-red-600 hover:to-rose-700 transition-all shadow-lg shadow-red-500/30"
          >
            첫 벼락 거지 기록하기
          </button>
        </div>
      )}

      <div className="flex gap-2 mt-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all ${
              s === step ? 'bg-red-400 w-6' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
