"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import BadgeUI from "@/components/ui/Badge";
import { MOCK_USER, MOCK_SHADOW_RECORDS } from "@/lib/mock-data";
import { formatKRW, formatPercent, calculateJomo, getRelativeTime } from "@/lib/utils";

export default function Home() {
  const { level } = MOCK_USER;
  const jomo = calculateJomo(MOCK_USER.totalDefendedAmount);
  const chickenItem = jomo.items.find((i) => i.name === "치킨");
  const recentRecords = MOCK_SHADOW_RECORDS.slice(0, 3);

  const successCount = MOCK_SHADOW_RECORDS.filter(
    (r) => r.result?.isDefenseSuccess
  ).length;

  const encourageMessage =
    MOCK_USER.defenseSuccessRate >= 70
      ? `방어 성공률 ${MOCK_USER.defenseSuccessRate}%! 흔들림 없는 철벽 투자자시네요.`
      : MOCK_SHADOW_RECORDS.length >= 5
        ? `${MOCK_SHADOW_RECORDS.length}번의 FOMO를 기록했어요. 기록만으로도 대단합니다.`
        : "참을수록 강해집니다. 오늘도 현명한 선택을 하세요.";

  return (
    <div className="flex flex-col gap-5 pb-4 pt-2">
      {/* 1-1. 레벨 프로필 영역 */}
      <div className="flex items-center gap-4 px-1">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-xl font-bold text-teal-600">
          Lv.{level.level}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{MOCK_USER.nickname}</span>
            <BadgeUI label={level.title} variant="info" size="sm" />
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <ProgressBar
              value={level.currentExp}
              max={level.nextLevelExp}
              color="blue"
              className="flex-1"
            />
            <span className="text-xs text-zinc-400">
              {level.currentExp}/{level.nextLevelExp} EXP
            </span>
          </div>
        </div>
      </div>

      {/* 1-2. 방어 금액 히어로 카드 */}
      <Link href="/jomo">
        <Card variant="highlight" className="active:scale-[0.98]">
          <p className="text-sm font-medium text-teal-700">총 방어 금액</p>
          <p className="mt-1 text-3xl font-extrabold text-teal-900">
            {formatKRW(MOCK_USER.totalDefendedAmount)}
          </p>
          {chickenItem && (
            <p className="mt-1 text-sm text-teal-600">
              치킨 {chickenItem.quantity}마리를 지켰어요 🍗
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-teal-700">
              <span>방어 {successCount}회</span>
              <span>성공률 {MOCK_USER.defenseSuccessRate}%</span>
            </div>
            <span className="text-xs text-teal-500">상세 보기 →</span>
          </div>
        </Card>
      </Link>

      {/* 1-3. FOMO 진입 CTA 버튼 */}
      <Link href="/pattern">
        <div className="rounded-2xl bg-zinc-900 px-5 py-4 text-center transition-all active:scale-[0.98]">
          <p className="text-base font-bold text-white">
            지금 사고 싶은 종목이 있다
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">
            과거 데이터가 당신의 직감을 검증합니다
          </p>
        </div>
      </Link>

      {/* 1-4. 최근 방어 기록 */}
      <div>
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-base font-bold">최근 방어 기록</h2>
          <Link
            href="/shadow-record"
            className="text-xs font-medium text-teal-500"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {recentRecords.map((record) => (
            <Card key={record.id} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
                  {record.ticker.symbol.slice(0, 2)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{record.ticker.name}</p>
                  <p className="text-xs text-zinc-400">
                    {getRelativeTime(record.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {record.result && (
                  <>
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        record.result.changePercent < 0
                          ? "text-blue-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatPercent(record.result.changePercent)}
                    </span>
                    <BadgeUI
                      label={
                        record.result.isDefenseSuccess
                          ? "방어성공"
                          : "방어실패"
                      }
                      variant={
                        record.result.isDefenseSuccess ? "success" : "danger"
                      }
                      size="sm"
                    />
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 1-5. 오늘의 한마디 */}
      <Card variant="default" className="text-center">
        <p className="text-sm text-zinc-500">{encourageMessage}</p>
      </Card>
    </div>
  );
}
