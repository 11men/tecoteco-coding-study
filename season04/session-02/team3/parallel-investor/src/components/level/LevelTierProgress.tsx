"use client";

import { LevelTier } from "@/lib/types";
import { LEVEL_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LevelTierProgressProps {
  currentLevel: number;
}

export default function LevelTierProgress({ currentLevel }: LevelTierProgressProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-bold text-zinc-100">
        레벨 티어
      </h2>
      <p className="text-sm text-zinc-400 mb-6">
        안 살수록 칭호가 올라간다
      </p>

      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-zinc-700" />

        <div className="space-y-6">
          {LEVEL_TIERS.map((tier, index) => {
            const isAchieved = currentLevel >= tier.level;
            const isCurrent = isCurrentTier(currentLevel, index);

            return (
              <div key={tier.level} className="relative flex items-start gap-3 sm:gap-4">
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs",
                    isCurrent &&
                      "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/25",
                    isAchieved && !isCurrent &&
                      "border-emerald-500 bg-emerald-500 text-white",
                    !isAchieved &&
                      "border-zinc-600 bg-zinc-800 text-zinc-500"
                  )}
                >
                  {isAchieved ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <rect x="3" y="2" width="4" height="5" rx="0.5" stroke="currentColor" strokeWidth="1" />
                      <circle cx="5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "flex-1 rounded-xl px-4 py-3 transition-all",
                    isCurrent &&
                      "bg-blue-500/10 ring-1 ring-blue-500/30",
                    isAchieved && !isCurrent &&
                      "bg-zinc-800/50",
                    !isAchieved &&
                      "opacity-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span
                        className={cn(
                          "text-xs font-bold shrink-0",
                          isCurrent && "text-blue-400",
                          isAchieved && !isCurrent && "text-emerald-400",
                          !isAchieved && "text-zinc-500"
                        )}
                      >
                        Lv.{tier.level}
                      </span>
                      <span
                        className={cn(
                          "text-sm sm:text-base font-bold shrink-0",
                          isCurrent && "text-zinc-100",
                          isAchieved && !isCurrent && "text-zinc-300",
                          !isAchieved && "text-zinc-500"
                        )}
                      >
                        {tier.title}
                      </span>
                      <span
                        className={cn(
                          "text-[11px] sm:text-xs truncate",
                          isCurrent && "text-zinc-400",
                          isAchieved && !isCurrent && "text-zinc-500",
                          !isAchieved && "text-zinc-600"
                        )}
                      >
                        {tier.titleEn}
                      </span>
                    </div>

                    {isCurrent && (
                      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        NOW
                      </span>
                    )}
                  </div>

                  <div className="mt-1">
                    <span
                      className={cn(
                        "text-xs",
                        isAchieved
                          ? "text-zinc-500"
                          : "text-zinc-600"
                      )}
                    >
                      필요 EXP: {tier.requiredExp.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function isCurrentTier(currentLevel: number, tierIndex: number): boolean {
  const tier = LEVEL_TIERS[tierIndex];
  const nextTier = LEVEL_TIERS[tierIndex + 1];

  if (!nextTier) {
    return currentLevel >= tier.level;
  }

  return currentLevel >= tier.level && currentLevel < nextTier.level;
}
