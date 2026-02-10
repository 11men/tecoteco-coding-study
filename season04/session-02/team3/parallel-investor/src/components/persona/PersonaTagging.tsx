"use client";

import { useState, useCallback } from "react";
import {
  PersonaTag,
  PersonaWhy,
  PersonaTime,
  PersonaRisk,
  StockTicker,
} from "@/lib/types";
import {
  PERSONA_WHY_OPTIONS,
  PERSONA_TIME_OPTIONS,
  PERSONA_RISK_OPTIONS,
  PERSONA_NICKNAMES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PersonaTaggingProps {
  ticker: StockTicker;
  onComplete: (persona: PersonaTag) => void;
  onCancel: () => void;
}

export default function PersonaTagging({
  ticker,
  onComplete,
  onCancel,
}: PersonaTaggingProps) {
  const [selectedWhy, setSelectedWhy] = useState<PersonaWhy | null>(null);
  const [selectedTime, setSelectedTime] = useState<PersonaTime | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<PersonaRisk | null>(null);

  const allSelected = selectedWhy && selectedTime && selectedRisk;

  const handleComplete = useCallback(() => {
    if (!selectedWhy || !selectedTime || !selectedRisk) return;

    const code = `${selectedWhy}${selectedTime}${selectedRisk}`;
    const match = PERSONA_NICKNAMES[code];
    const nickname = match?.nickname ?? "알 수 없는 투자자";
    const emoji = match?.emoji ?? "🤔";

    const persona: PersonaTag = {
      why: selectedWhy,
      time: selectedTime,
      risk: selectedRisk,
      code,
      nickname,
      emoji,
    };

    onComplete(persona);
  }, [selectedWhy, selectedTime, selectedRisk, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0f]/95 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-safe-top">
        <div className="py-4">
          <h1 className="text-xl font-bold text-zinc-100">
            그래도 산다고?
          </h1>
          <p className="text-sm text-blue-400 mt-0.5">
            {ticker.name}{" "}
            <span className="text-zinc-500">{ticker.symbol}</span>
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
          aria-label="닫기"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="5" y1="5" x2="15" y2="15" />
            <line x1="15" y1="5" x2="5" y2="15" />
          </svg>
        </button>
      </div>

      {/* Questions */}
      <div className="flex-1 flex flex-col justify-center gap-7 px-5 pb-4">
        {/* Q1: Why */}
        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-semibold text-zinc-300">
            왜 사려고?
          </p>
          <div className="flex gap-2">
            {PERSONA_WHY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedWhy(option.value)}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-3 text-sm font-medium transition-all min-h-[44px]",
                  selectedWhy === option.value
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 active:bg-zinc-800"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q2: Time */}
        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-semibold text-zinc-300">
            얼마나 들고 있을 건데?
          </p>
          <div className="flex gap-2">
            {PERSONA_TIME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedTime(option.value)}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-3 text-sm font-medium transition-all min-h-[44px]",
                  selectedTime === option.value
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 active:bg-zinc-800"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q3: Risk */}
        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-semibold text-zinc-300">
            얼마나 확신해?
          </p>
          <div className="flex gap-2">
            {PERSONA_RISK_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedRisk(option.value)}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-3 text-sm font-medium transition-all min-h-[44px]",
                  selectedRisk === option.value
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 active:bg-zinc-800"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 pb-8 pt-2">
        <button
          onClick={handleComplete}
          disabled={!allSelected}
          className={cn(
            "w-full rounded-xl py-4 text-base font-bold transition-all min-h-[44px]",
            allSelected
              ? "bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          )}
        >
          기록하기
        </button>
      </div>
    </div>
  );
}
