"use client";

import { useEffect, useRef } from "react";

interface DefenseSuccessProps {
  tickerName: string;
  onClose: () => void;
}

export default function DefenseSuccess({ tickerName, onClose }: DefenseSuccessProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onClose();
    }, 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]/95 backdrop-blur-xl"
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClose(); }}
    >
      <div className="flex flex-col items-center gap-5 px-8 text-center">
        <span className="block leading-none" style={{ fontSize: "80px" }} role="img" aria-label="방어 성공">
          🛡️
        </span>
        <h2 className="text-3xl font-bold text-zinc-100">잘했어.</h2>
        <p className="text-sm text-zinc-400">{tickerName} 안 샀어. 기록했어.</p>
        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-4 py-1.5 text-sm font-semibold text-emerald-400">
          +25 EXP
        </span>
        <p className="text-xs text-zinc-600 mt-2">장 마감 후 결과 알려줄게.</p>
      </div>
    </div>
  );
}
