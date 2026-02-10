import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatKRW } from '../utils/format';
import jomoItemsData from '../data/jomo-items.json';
import type { JomoItem } from '../types';

export default function Share() {
  const { user } = useApp();
  const [copied, setCopied] = useState(false);

  const jomoItems = jomoItemsData as JomoItem[];
  const chickenItem = jomoItems.find((item) => item.id === 'chicken');
  const chickenCount = chickenItem ? Math.floor(user.totalLoss / chickenItem.price) : 0;

  const shareText = `📉 이달의 마이너스의 손

가상 손실액: -${user.totalLoss.toLocaleString()}원
= 치킨 ${chickenCount}마리

랭킹: 전체 23위 / 4,821명
레벨: Lv.${user.level} ${user.levelTitle}

#마이너스의손 #섀도우포트폴리오`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSaveImage = () => {
    // In a real app, we'd use html2canvas here
    alert('이미지 저장 기능은 html2canvas 라이브러리가 필요합니다. 현재는 UI만 구현되어 있습니다.');
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-6">결과 공유</h1>

      {/* Share Card Preview */}
      <div className="mb-6" id="share-card">
        <div className="gradient-share rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📉</div>
            <p className="text-gray-400 text-sm">이달의</p>
            <h2 className="text-2xl font-bold text-white">마이너스의 손</h2>
          </div>

          {/* Loss Amount */}
          <div className="bg-black/30 rounded-xl p-5 mb-4">
            <p className="text-gray-400 text-sm mb-1 text-center">가상 손실액</p>
            <p className="text-3xl font-bold text-red-400 text-center">
              -{formatKRW(user.totalLoss)}
            </p>
          </div>

          {/* Equivalent Value */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-xl">=</span>
            <span className="text-3xl">🍗</span>
            <span className="text-white text-xl font-bold">치킨 {chickenCount}마리</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">랭킹</p>
              <p className="text-white font-bold">
                <span className="text-yellow-400">23위</span> / 4,821명
              </p>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">레벨</p>
              <p className="text-yellow-400 font-bold">
                Lv.{user.level} {user.levelTitle}
              </p>
            </div>
          </div>

          {/* Hashtags */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">#마이너스의손 #섀도우포트폴리오</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleSaveImage}
          className="w-full py-4 rounded-xl bg-gray-800 text-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          이미지로 저장
        </button>

        <button
          onClick={handleCopyText}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              복사 완료!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              클립보드 복사
            </>
          )}
        </button>
      </div>

      {/* Share Preview Text */}
      <div className="mt-6">
        <p className="text-gray-500 text-sm mb-2">복사될 텍스트:</p>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
            {shareText}
          </pre>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="mt-6">
        <p className="text-gray-500 text-sm mb-3 text-center">SNS에 공유하기</p>
        <div className="flex items-center justify-center gap-4">
          <button className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center hover:opacity-80 transition-opacity">
            <span className="text-xl">💬</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center hover:opacity-80 transition-opacity">
            <span className="text-xl">🐦</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center hover:opacity-80 transition-opacity">
            <span className="text-xl">📸</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center hover:opacity-80 transition-opacity">
            <span className="text-xl">📱</span>
          </button>
        </div>
      </div>
    </div>
  );
}
