"use client";

import { formatKRW } from "@/lib/utils";

interface AnalysisLimitReachedProps {
  totalDefended: number;
  defenseCount: number;
  onClose?: () => void;
}

export default function AnalysisLimitReached({
  totalDefended,
  defenseCount,
  onClose,
}: AnalysisLimitReachedProps) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-[70vh] flex-col items-center justify-center px-4 text-center bg-[#0a0a0f]/95 backdrop-blur-xl">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
        이번 달 분석 다 썼어.
      </h1>

      <div className="mt-8 w-full max-w-sm rounded-2xl border border-zinc-700/60 bg-zinc-900/80 p-5 shadow-xl shadow-black/30 backdrop-blur-xl">
        <p className="text-sm text-zinc-500 uppercase tracking-widest font-mono mb-4">이번 달 방어 성적</p>
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-800/50 p-3 text-center">
            <p className="text-xl font-bold text-zinc-100 tabular-nums">{defenseCount}회</p>
            <p className="text-xs text-zinc-500 mt-0.5">방어 성공</p>
          </div>
          <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-800/50 p-3 text-center">
            <p className="text-xl font-bold text-emerald-400 tabular-nums">{formatKRW(totalDefended)}</p>
            <p className="text-xs text-zinc-500 mt-0.5">세이브 금액</p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-lg font-medium text-zinc-300">
        {formatKRW(totalDefended)} 지켰는데,<br />
        <span className="text-zinc-100">9,900원 아끼려고?</span>
      </p>

      <button
        type="button"
        className="mt-6 inline-flex w-full max-w-sm items-center justify-center rounded-xl bg-blue-500 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-600 active:scale-95"
      >
        SOLID 시작하기
      </button>

      <button
        type="button"
        onClick={onClose}
        className="mt-3 py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-400"
      >
        다음 달까지 참기
      </button>
    </div>
  );
}
