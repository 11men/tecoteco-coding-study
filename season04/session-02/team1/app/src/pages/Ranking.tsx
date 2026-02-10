import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatKRW, getRemainingDays } from '../utils/format';
import LevelBadge from '../components/LevelBadge';
import rankingData from '../data/ranking.json';
import challengesData from '../data/challenges.json';
import type { RankingUser, Challenge } from '../types';
import macbookImg from '../assets/ranking/macbook.svg';
import ipadImg from '../assets/ranking/ipad.svg';
import iphoneImg from '../assets/ranking/iphone.svg';

type MainTabType = 'loss' | 'gain';
type SubTabType = 'all' | 'challenge';

const RANK_PRODUCTS = [
  { key: 1, label: '맥북', img: macbookImg, price: 2_000_000 },
  { key: 2, label: '아이패드', img: ipadImg, price: 800_000 },
  { key: 3, label: '아이폰', img: iphoneImg, price: 1_200_000 },
] as const;

function getProductLossText(rank: number, totalLoss: number): string {
  const index = (rank - 1) % 3;
  const product = RANK_PRODUCTS[index];
  const count = Math.floor(totalLoss / product.price);
  return `당신은 ${product.label} ${count.toLocaleString()}개를 잃었습니다.`;
}

const MOCK_COMMENTS_BY_RANK: Record<number, string[]> = {
  1: [
    '역시 1등은 각이 다르네요 👑',
    '이 정도면 진정한 마이너스의 손',
    '맥북 몇 대 날리셨네요',
    '전국 1등 손실러 등극',
  ],
  2: [
    '2등도 대단해요, 아이패드 한 대는 날린 셈',
    '1등이 부럽죠? 다음엔 더 잃어보세요',
    '은메달... 아니 은(銀)손실',
  ],
  3: [
    '3등 안에 드셨네요, 아이폰은 포기하셨나요',
    '동메달 수상! 손실의 정석',
    '탑3 진입, 축하합니다 (?)',
  ],
};

const MOCK_COMMENTS_GENERAL = [
  '이 돈이면 제주도 갈 수 있었는데 ✈️',
  '치킨 몇 마리 날린 셈이에요 🍗',
  '손실의 달인',
  '가상이라 다행이죠...',
  '다음엔 올라갈 거예요. 아니면 더 떨어질 수도',
  'FOMO의 정석이네요',
  '랭킹 올라가려면 더 잃어야 해요',
  '진정한 벼락 거지',
];

function getMockComments(rank: number, totalLoss: number): string[] {
  if (rank <= 3) {
    const list = MOCK_COMMENTS_BY_RANK[rank];
    const idx = totalLoss % list.length;
    return [list[idx]];
  }
  const idx1 = (rank + totalLoss) % MOCK_COMMENTS_GENERAL.length;
  const idx2 = (rank + totalLoss + 7) % MOCK_COMMENTS_GENERAL.length;
  if (idx1 === idx2) {
    return [MOCK_COMMENTS_GENERAL[idx1]];
  }
  return [MOCK_COMMENTS_GENERAL[idx1], MOCK_COMMENTS_GENERAL[idx2]];
}

const MOCK_COMMENTS_GAIN = [
  '잔고 부자네요 💰',
  '아직 안 날리셨나요?',
  '이득 랭킹 1등 각이에요',
  '가상 자산 지키는 달인',
  '손실 랭킹은 관심 없으시죠',
  '이 돈이면 치킨 많이 사먹을 수 있어요 🍗',
  '벼락 부자 후보',
  '다음엔 손실 랭킹 도전해 보세요 (?)',
];

function getMockCommentsGain(rank: number, virtualBalance: number): string[] {
  const idx = (rank + virtualBalance) % MOCK_COMMENTS_GAIN.length;
  return [MOCK_COMMENTS_GAIN[idx]];
}

export default function Ranking() {
  const { user } = useApp();
  const [mainTab, setMainTab] = useState<MainTabType>('loss');
  const [subTab, setSubTab] = useState<SubTabType>('all');

  const rawRankings = rankingData as RankingUser[];
  const rankings = rawRankings;
  const gainRankings = useMemo(
    () =>
      [...rawRankings]
        .sort((a, b) => b.virtualBalance - a.virtualBalance)
        .map((r, i) => ({ ...r, rank: i + 1 })),
    [rawRankings]
  );
  const challenges = challengesData as Challenge[];

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-6">랭킹</h1>

      {/* 메인 탭: 손실 랭킹 / 이득 랭킹 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMainTab('loss')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            mainTab === 'loss'
              ? 'bg-red-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          손실 랭킹
        </button>
        <button
          onClick={() => setMainTab('gain')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            mainTab === 'gain'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          이득 랭킹
        </button>
      </div>

      {mainTab === 'loss' ? (
        <>
          {/* 손실 랭킹: 서브 탭 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSubTab('all')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                subTab === 'all'
                  ? 'bg-red-500/80 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              전체 랭킹
            </button>
            <button
              onClick={() => setSubTab('challenge')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                subTab === 'challenge'
                  ? 'bg-red-500/80 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              이번달 챌린지
            </button>
          </div>

          {subTab === 'all' ? (
        <>
          {/* Top 3 - 맥북 / 아이패드 / 아이폰 */}
          <div className="flex items-end justify-center gap-2 mb-8">
            {/* 2위 - 아이패드 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-2 flex items-center justify-center text-gray-400">
                <img src={ipadImg} alt="아이패드" className="w-10 h-10 object-contain" />
              </div>
              <div className="w-20 h-24 bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-lg flex flex-col items-center justify-end pb-2">
                <p className="text-white font-bold text-sm truncate max-w-full px-1">
                  {rankings[1]?.nickname}
                </p>
                <p className="text-gray-400 text-[10px]">누적손실금액</p>
                <p className="text-yellow-400 text-xs">
                  {formatKRW(rankings[1]?.totalLoss || 0)}
                </p>
                <p className="text-gray-400 text-[10px] mt-1 px-1 text-center leading-tight">
                  {rankings[1] && getProductLossText(2, rankings[1].totalLoss)}
                </p>
                {rankings[1] && getMockComments(2, rankings[1].totalLoss).map((c, i) => (
                  <p key={i} className="text-gray-500 text-[9px] mt-0.5 px-1 text-center italic">
                    "{c}"
                  </p>
                ))}
              </div>
            </div>

            {/* 1위 - 맥북 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 mb-2 flex items-center justify-center text-gray-300">
                <img src={macbookImg} alt="맥북" className="w-12 h-8 object-contain" />
              </div>
              <div className="w-24 h-32 bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t-lg flex flex-col items-center justify-end pb-2">
                <p className="text-white font-bold truncate max-w-full px-1">
                  {rankings[0]?.nickname}
                </p>
                <p className="text-yellow-100/90 text-[10px]">누적손실금액</p>
                <p className="text-yellow-100 text-sm">
                  {formatKRW(rankings[0]?.totalLoss || 0)}
                </p>
                <p className="text-yellow-100/80 text-[10px] mt-1 px-1 text-center leading-tight">
                  {rankings[0] && getProductLossText(1, rankings[0].totalLoss)}
                </p>
                {rankings[0] && getMockComments(1, rankings[0].totalLoss).map((c, i) => (
                  <p key={i} className="text-yellow-100/70 text-[9px] mt-0.5 px-1 text-center italic">
                    "{c}"
                  </p>
                ))}
              </div>
            </div>

            {/* 3위 - 아이폰 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-2 flex items-center justify-center text-gray-400">
                <img src={iphoneImg} alt="아이폰" className="w-8 h-10 object-contain" />
              </div>
              <div className="w-20 h-20 bg-gradient-to-t from-orange-800 to-orange-700 rounded-t-lg flex flex-col items-center justify-end pb-2">
                <p className="text-white font-bold text-sm truncate max-w-full px-1">
                  {rankings[2]?.nickname}
                </p>
                <p className="text-orange-200/90 text-[10px]">누적손실금액</p>
                <p className="text-orange-200 text-xs">
                  {formatKRW(rankings[2]?.totalLoss || 0)}
                </p>
                <p className="text-orange-200/80 text-[10px] mt-1 px-1 text-center leading-tight">
                  {rankings[2] && getProductLossText(3, rankings[2].totalLoss)}
                </p>
                {rankings[2] && getMockComments(3, rankings[2].totalLoss).map((c, i) => (
                  <p key={i} className="text-orange-200/70 text-[9px] mt-0.5 px-1 text-center italic">
                    "{c}"
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Full Ranking List */}
          <div className="space-y-2">
            {rankings.map((ranker) => {
              const isMe = ranker.userId === user.id;
              return (
                <div
                  key={ranker.userId}
                  className={`p-4 rounded-xl flex items-center gap-4 ${
                    isMe
                      ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/50'
                      : 'bg-gray-800/50 border border-gray-700/50'
                  }`}
                >
                  <div className="w-10 flex justify-center items-center shrink-0">
                    <span className={`font-bold ${isMe ? 'text-red-400' : 'text-gray-500'}`}>
                      {ranker.rank}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-semibold truncate ${isMe ? 'text-white' : 'text-gray-300'}`}>
                        {ranker.nickname}
                        {isMe && <span className="text-red-400 ml-1">(나)</span>}
                      </p>
                    </div>
                    <LevelBadge level={ranker.level} title={ranker.levelTitle} size="sm" />
                    <p className="text-gray-500 text-xs mt-1">
                      {getProductLossText(ranker.rank, ranker.totalLoss)}
                    </p>
                    <div className="mt-1.5 space-y-0.5">
                      {getMockComments(ranker.rank, ranker.totalLoss).map((c, i) => (
                        <p key={i} className="text-gray-500 text-xs italic">
                          "{c}"
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-500 text-xs mb-0.5">누적손실금액</p>
                    <p className="text-yellow-400 font-bold">
                      {formatKRW(ranker.totalLoss)}
                    </p>
                    <p className={`text-xs ${ranker.virtualBalance < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                      잔고: {formatKRW(ranker.virtualBalance)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge) => {
            const remainingDays = getRemainingDays(challenge.endDate);

            return (
              <div
                key={challenge.id}
                className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white font-bold text-lg mb-1">{challenge.title}</p>
                    <p className="text-gray-400 text-sm">{challenge.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                    D-{remainingDays}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-xs">참여 인원</p>
                    <p className="text-white font-semibold">
                      {challenge.participants.toLocaleString()}명
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">내 순위</p>
                    <p className="text-red-400 font-bold text-lg">
                      {challenge.myRank}위
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <p className="text-gray-500 text-xs mb-2">상위권</p>
                  <div className="space-y-2">
                    {challenge.topRankers.map((ranker) => (
                      <div
                        key={ranker.rank}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="w-6 text-center font-bold text-gray-500 shrink-0">
                            {ranker.rank}
                          </span>
                          <div className="min-w-0">
                            <span className="text-gray-300">{ranker.nickname}</span>
                            <p className="text-gray-500 text-xs truncate">
                              {getProductLossText(ranker.rank, ranker.totalLoss)}
                            </p>
                            {getMockComments(ranker.rank, ranker.totalLoss).map((c, i) => (
                              <p key={i} className="text-gray-500 text-[10px] italic truncate">
                                "{c}"
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-gray-500 text-[10px]">누적손실금액</p>
                          <span className="text-yellow-400 font-medium">
                            {formatKRW(ranker.totalLoss)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-500 text-xs mb-1">보상</p>
                  <p className="text-yellow-300 text-sm">{challenge.prize}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      ) : (
        /* 이득 랭킹 */
        <>
          <p className="text-gray-400 text-sm mb-4">잔고가 많은 순입니다.</p>
          {/* 이득 Top 3 - 맥북 / 아이패드 / 아이폰 */}
          <div className="flex items-end justify-center gap-2 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-2 flex items-center justify-center text-gray-400">
                <img src={ipadImg} alt="아이패드" className="w-10 h-10 object-contain" />
              </div>
              <div className="w-20 h-24 bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-lg flex flex-col items-center justify-end pb-2">
                <p className="text-white font-bold text-sm truncate max-w-full px-1">
                  {gainRankings[1]?.nickname}
                </p>
                <p className="text-gray-400 text-[10px]">잔고</p>
                <p className="text-emerald-400 text-xs">
                  {formatKRW(gainRankings[1]?.virtualBalance ?? 0)}
                </p>
                {gainRankings[1] && getMockCommentsGain(2, gainRankings[1].virtualBalance).map((c, i) => (
                  <p key={i} className="text-gray-500 text-[9px] mt-0.5 px-1 text-center italic">
                    "{c}"
                  </p>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 mb-2 flex items-center justify-center text-gray-300">
                <img src={macbookImg} alt="맥북" className="w-12 h-8 object-contain" />
              </div>
              <div className="w-24 h-32 bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-t-lg flex flex-col items-center justify-end pb-2">
                <p className="text-white font-bold truncate max-w-full px-1">
                  {gainRankings[0]?.nickname}
                </p>
                <p className="text-emerald-100/90 text-[10px]">잔고</p>
                <p className="text-emerald-100 text-sm">
                  {formatKRW(gainRankings[0]?.virtualBalance ?? 0)}
                </p>
                {gainRankings[0] && getMockCommentsGain(1, gainRankings[0].virtualBalance).map((c, i) => (
                  <p key={i} className="text-emerald-100/70 text-[9px] mt-0.5 px-1 text-center italic">
                    "{c}"
                  </p>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-2 flex items-center justify-center text-gray-400">
                <img src={iphoneImg} alt="아이폰" className="w-8 h-10 object-contain" />
              </div>
              <div className="w-20 h-20 bg-gradient-to-t from-teal-800 to-teal-700 rounded-t-lg flex flex-col items-center justify-end pb-2">
                <p className="text-white font-bold text-sm truncate max-w-full px-1">
                  {gainRankings[2]?.nickname}
                </p>
                <p className="text-teal-200/90 text-[10px]">잔고</p>
                <p className="text-teal-200 text-xs">
                  {formatKRW(gainRankings[2]?.virtualBalance ?? 0)}
                </p>
                {gainRankings[2] && getMockCommentsGain(3, gainRankings[2].virtualBalance).map((c, i) => (
                  <p key={i} className="text-teal-200/70 text-[9px] mt-0.5 px-1 text-center italic">
                    "{c}"
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {gainRankings.map((ranker) => {
              const isMe = ranker.userId === user.id;
              return (
                <div
                  key={ranker.userId}
                  className={`p-4 rounded-xl flex items-center gap-4 ${
                    isMe
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50'
                      : 'bg-gray-800/50 border border-gray-700/50'
                  }`}
                >
                  <div className="w-10 flex justify-center items-center shrink-0">
                    <span className={`font-bold ${isMe ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {ranker.rank}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-semibold truncate ${isMe ? 'text-white' : 'text-gray-300'}`}>
                        {ranker.nickname}
                        {isMe && <span className="text-emerald-400 ml-1">(나)</span>}
                      </p>
                    </div>
                    <LevelBadge level={ranker.level} title={ranker.levelTitle} size="sm" />
                    <div className="mt-1.5 space-y-0.5">
                      {getMockCommentsGain(ranker.rank, ranker.virtualBalance).map((c, i) => (
                        <p key={i} className="text-gray-500 text-xs italic">
                          "{c}"
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs mb-0.5">잔고</p>
                    <p className={`font-bold ${ranker.virtualBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatKRW(ranker.virtualBalance)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      누적손실: {formatKRW(ranker.totalLoss)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
