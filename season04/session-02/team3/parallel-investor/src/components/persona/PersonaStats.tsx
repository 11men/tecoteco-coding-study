// ============================================
// Feature E: Persona Stats (투자 패턴 통계)
// Owner: Team E
// ============================================
// 이 컴포넌트는 Team E가 담당합니다.

"use client";

import { PersonaStats as PersonaStatsType, PersonaWhy } from "@/lib/types";
import { PERSONA_NICKNAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import PremiumBadge from "@/components/premium/PremiumBadge";

interface PersonaStatsProps {
  stats: PersonaStatsType;
  isPremium: boolean;
}

/** WHY 코드에서 비율(%) 계산 */
function getWhyDistribution(
  stats: PersonaStatsType
): { why: PersonaWhy; percent: number }[] {
  const total = stats.totalRecords;
  if (total === 0) {
    return (["N", "C", "F"] as PersonaWhy[]).map((w) => ({
      why: w,
      percent: 0,
    }));
  }

  // typeDistribution의 코드(예: "NSH")에서 첫 글자(why)만 추출해 합산
  const whyCounts: Record<PersonaWhy, number> = { N: 0, C: 0, F: 0 };
  for (const [code, count] of Object.entries(stats.typeDistribution)) {
    const why = code.charAt(0) as PersonaWhy;
    if (why in whyCounts) {
      whyCounts[why] += count;
    }
  }

  return (["N", "C", "F"] as PersonaWhy[]).map((w) => ({
    why: w,
    percent: Math.round((whyCounts[w] / total) * 100),
  }));
}

/** WHY 이모지 매핑 */
const WHY_EMOJI: Record<PersonaWhy, string> = {
  N: "📰",
  C: "📈",
  F: "🎯",
};

const WHY_LABEL: Record<PersonaWhy, string> = {
  N: "뉴스",
  C: "차트",
  F: "감",
};

const BAR_COLORS: Record<PersonaWhy, string> = {
  N: "bg-amber-500",
  C: "bg-emerald-500",
  F: "bg-purple-500",
};

export default function PersonaStats({
  stats,
  isPremium,
}: PersonaStatsProps) {
  const distribution = getWhyDistribution(stats);

  // 대표 유형 정보
  const mainType = stats.mostFrequentType;
  const personaInfo = PERSONA_NICKNAMES[mainType] ?? {
    nickname: "미분류",
    emoji: "❓",
    risk: "알 수 없음",
  };

  return (
    <div className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      {/* 헤더 + 대표 유형 */}
      <div>
        <p className="mb-3 text-sm font-medium text-zinc-400">
          📊 나의 투자 패턴
        </p>

        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{personaInfo.emoji}</span>
          <div>
            <p className="text-lg font-bold text-zinc-100">
              대표 유형:{" "}
              <span className="text-blue-400">{mainType}</span>{" "}
              {personaInfo.nickname}
            </p>
            <p className="text-sm text-zinc-500">
              {getTypeDescription(mainType)}
            </p>
          </div>
        </div>
      </div>

      {/* 이유별 비율 바 */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
          이유별 비율
        </p>

        {/* 가로 바 */}
        <div className="flex h-8 overflow-hidden rounded-lg">
          {distribution.map(({ why, percent }) =>
            percent > 0 ? (
              <div
                key={why}
                className={cn(
                  "flex items-center justify-center text-xs font-bold text-zinc-900 transition-all",
                  BAR_COLORS[why]
                )}
                style={{ width: `${percent}%` }}
              >
                {why} {percent}%
              </div>
            ) : null
          )}
          {/* 기록 없으면 빈 바 */}
          {distribution.every((d) => d.percent === 0) && (
            <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-xs text-zinc-500">
              기록 없음
            </div>
          )}
        </div>

        {/* 범례 */}
        <div className="mt-2 flex gap-4">
          {distribution.map(({ why, percent }) => (
            <div key={why} className="flex items-center gap-1.5">
              <div
                className={cn("h-2.5 w-2.5 rounded-full", BAR_COLORS[why])}
              />
              <span className="text-xs text-zinc-400">
                {WHY_EMOJI[why]} {WHY_LABEL[why]} ({why}) {percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 이유별 성적표 */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
          이유별 성적표
        </p>

        <div className="space-y-2">
          {(["N", "C", "F"] as PersonaWhy[]).map((why) => {
            const record = stats.winRateByWhy[why];
            const losses = record.total - record.wins;
            const winRate =
              record.total > 0
                ? Math.round((record.wins / record.total) * 100)
                : -1; // -1 = 기록 없음

            return (
              <div
                key={why}
                className="flex items-center justify-between rounded-xl bg-zinc-800/60 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{WHY_EMOJI[why]}</span>
                  <span className="text-sm font-medium text-zinc-300">
                    {WHY_LABEL[why]}({why})
                  </span>
                </div>

                {winRate >= 0 ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-300">
                      <span className="text-emerald-400">{record.wins}승</span>
                      {" "}
                      <span className="text-red-400">{losses}패</span>
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-xs font-bold",
                        winRate >= 50
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      )}
                    >
                      승률 {winRate}%
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-600">기록 없음</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SOLID 티저 - 무료 유저에게만 표시 */}
      {!isPremium && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <PremiumBadge size="sm" />
            <span className="text-sm font-bold text-zinc-200">
              SOLID이면:
            </span>
          </div>
          <ul className="space-y-1.5 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="text-blue-400">-</span>
              월간/연간 변화 추이 그래프
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-400">-</span>
              시간대별 매수 패턴
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-400">-</span>
              <span className="italic text-zinc-500">
                &quot;금요일 밤엔 절대 사지 마&quot;
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

/** 대표 유형에 따른 한 줄 설명 생성 */
function getTypeDescription(code: string): string {
  const whyChar = code.charAt(0);
  const timeChar = code.charAt(1);
  const riskChar = code.charAt(2);

  const whyDesc: Record<string, string> = {
    N: "뉴스 보고",
    C: "차트 보고",
    F: "감으로",
  };

  const timeDesc: Record<string, string> = {
    S: "단타에",
    W: "스윙에",
    H: "존버에",
  };

  const riskDesc: Record<string, string> = {
    H: "올인하는 타입",
    L: "조심스럽게 들어가는 타입",
  };

  return `${whyDesc[whyChar] ?? "?"} ${timeDesc[timeChar] ?? "?"} ${riskDesc[riskChar] ?? "?"}`;
}
