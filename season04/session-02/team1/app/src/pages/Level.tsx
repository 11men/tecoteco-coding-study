import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatKRW } from '../utils/format';
import levelsData from '../data/levels.json';
import badgesData from '../data/badges.json';
import type { LevelInfo, Badge } from '../types';

export default function Level() {
  const { user } = useApp();

  const levels = levelsData as LevelInfo[];
  const badges = badgesData as Badge[];

  const currentLevelInfo = useMemo(() => {
    return levels.find((l) => l.level === user.level) || levels[0];
  }, [levels, user.level]);

  const nextLevelInfo = useMemo(() => {
    const nextLevelIndex = levels.findIndex((l) => l.level === user.level) + 1;
    return levels[nextLevelIndex] || null;
  }, [levels, user.level]);

  const progress = useMemo(() => {
    if (!nextLevelInfo) return 100;
    const currentMin = currentLevelInfo.minLoss;
    const nextMin = nextLevelInfo.minLoss;
    const range = nextMin - currentMin;
    const userProgress = user.totalLoss - currentMin;
    return Math.min(100, Math.max(0, (userProgress / range) * 100));
  }, [user.totalLoss, currentLevelInfo, nextLevelInfo]);

  const unlockedBadges = badges.filter((b) => user.badges.includes(b.id));
  const lockedBadges = badges.filter((b) => !user.badges.includes(b.id));

  return (
    <div className="px-4 py-6">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 mx-auto mb-4 flex items-center justify-center text-4xl">
          👤
        </div>
        <h1 className="text-xl font-bold text-white mb-1">{user.nickname}</h1>
        <p className="text-gray-400 text-sm">가입일: {user.joinedAt}</p>
      </div>

      {/* Current Level Card */}
      <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl p-6 mb-6 border border-yellow-500/30">
        <div className="text-center mb-4">
          <p className="text-yellow-400 text-sm mb-2">현재 레벨</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl font-bold text-yellow-400">Lv.{user.level}</span>
          </div>
          <p className="text-yellow-300 text-xl font-semibold mt-2">{user.levelTitle}</p>
        </div>

        {nextLevelInfo && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">다음 레벨까지</span>
              <span className="text-yellow-400 font-medium">
                {formatKRW(nextLevelInfo.minLoss - user.totalLoss)}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-gray-500">Lv.{user.level}</span>
              <span className="text-gray-500">Lv.{nextLevelInfo.level}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">누적 손실</p>
          <p className="text-red-400 font-bold text-lg">{formatKRW(user.totalLoss)}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">총 충전액</p>
          <p className="text-gray-300 font-bold text-lg">{formatKRW(user.totalDeposited)}</p>
        </div>
      </div>

      {/* Level Roadmap */}
      <div className="mb-8">
        <h2 className="text-white font-semibold mb-4">레벨 로드맵</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
          <div className="space-y-4">
            {levels.filter((l) => l.level <= 15 || l.level === 99).map((level) => {
              const isCurrentOrPast = level.level <= user.level;
              const isCurrent = level.level === user.level;

              return (
                <div key={level.level} className="flex items-center gap-4 relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      isCurrent
                        ? 'bg-yellow-500 text-gray-900'
                        : isCurrentOrPast
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-500'
                    }`}
                  >
                    {isCurrentOrPast ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      level.level
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-medium ${isCurrent ? 'text-yellow-400' : isCurrentOrPast ? 'text-white' : 'text-gray-500'}`}>
                          Lv.{level.level}
                        </span>
                        <span className={`ml-2 text-sm ${isCurrent ? 'text-yellow-300' : isCurrentOrPast ? 'text-gray-400' : 'text-gray-600'}`}>
                          {level.title}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {formatKRW(level.minLoss)}+
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-white font-semibold mb-4">배지 컬렉션</h2>

        {unlockedBadges.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-3">획득한 배지</p>
            <div className="grid grid-cols-4 gap-3">
              {unlockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex flex-col items-center justify-center p-2 border border-gray-600"
                >
                  <span className="text-3xl mb-1">{badge.emoji}</span>
                  <p className="text-white text-xs text-center truncate w-full">
                    {badge.name.split(' ')[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {lockedBadges.length > 0 && (
          <div>
            <p className="text-gray-500 text-sm mb-3">미획득 배지</p>
            <div className="grid grid-cols-4 gap-3">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="aspect-square bg-gray-800/50 rounded-xl flex flex-col items-center justify-center p-2 border border-gray-700/50 relative"
                >
                  <span className="text-3xl mb-1 grayscale opacity-40">{badge.emoji}</span>
                  <p className="text-gray-600 text-xs text-center truncate w-full">
                    {badge.name.split(' ')[0]}
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">🔒</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
