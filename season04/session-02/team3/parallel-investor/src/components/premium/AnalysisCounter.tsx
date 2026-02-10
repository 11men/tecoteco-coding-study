"use client";

import { cn } from "@/lib/utils";

interface AnalysisCounterProps {
  used: number;
  limit: number;
  isPremium: boolean;
}

export default function AnalysisCounter({
  used,
  limit,
  isPremium,
}: AnalysisCounterProps) {
  if (isPremium) {
    return (
      <p className="text-right text-xs font-medium text-blue-400">
        &#x26A1; 무제한 분석
      </p>
    );
  }

  const remaining = limit - used;
  const isExhausted = remaining <= 0;
  const isWarning = remaining === 1;

  if (isExhausted) {
    return (
      <p className="text-right text-xs font-medium text-red-400">
        이번 달 분석을 모두 사용했습니다
      </p>
    );
  }

  return (
    <p
      className={cn(
        "text-right text-xs font-medium",
        isWarning ? "text-amber-400" : "text-zinc-500"
      )}
    >
      이번 달 {used}/{limit}회 분석
    </p>
  );
}
