"use client";

import { useEffect, useRef } from "react";
import { PersonaTag } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PersonaResultProps {
  persona: PersonaTag;
  tickerName: string;
  onClose: () => void;
}

export default function PersonaResult({
  persona,
  tickerName,
  onClose,
}: PersonaResultProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onClose();
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onClose]);

  const isHighRisk = persona.risk === "H";
  const riskLabel = isHighRisk ? "극확신" : "정찰병";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]/95 backdrop-blur-xl"
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClose();
      }}
    >
      <div className="flex flex-col items-center gap-5 px-8 text-center">
        {/* Emoji */}
        <span
          className="block leading-none"
          style={{ fontSize: "80px" }}
          role="img"
          aria-label={persona.nickname}
        >
          {persona.emoji}
        </span>

        {/* Nickname */}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-sm text-zinc-500">오늘의 너:</p>
          <h2 className="text-2xl font-bold text-zinc-100">
            {persona.nickname}
          </h2>
        </div>

        {/* Code */}
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-sm font-mono font-semibold text-zinc-300">
            [{persona.code}]
          </span>
          <span
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold",
              isHighRisk
                ? "bg-red-500/10 border border-red-500/30 text-red-400"
                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            )}
          >
            {riskLabel}
          </span>
        </div>

        {/* Ticker context */}
        <p className="text-sm text-zinc-500 mt-2">
          {tickerName} 매수 기록
        </p>

        {/* Message */}
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
          기록했어. 장 마감 후 결과 알려줄게.
        </p>

        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="mt-4 w-full max-w-[280px] rounded-xl bg-zinc-800 border border-zinc-700 py-3.5 text-base font-semibold text-zinc-300 hover:bg-zinc-700 active:scale-[0.98] transition-all min-h-[44px]"
        >
          알겠어
        </button>
      </div>
    </div>
  );
}
