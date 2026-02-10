"use client";

import { cn } from "@/lib/utils";

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
}

export default function PremiumGate({
  children,
  feature,
  description,
}: PremiumGateProps) {
  return (
    <div className="relative">
      {/* Blurred content underneath */}
      <div
        className="pointer-events-none select-none blur-sm opacity-60"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-700/60 bg-zinc-900/80 p-6 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
          {/* SOLID Badge */}
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
            &#x26A1; SOLID 전용
          </span>

          {/* Feature name */}
          <h3 className="mt-4 text-lg font-semibold text-zinc-100">
            {feature}
          </h3>

          {/* Description */}
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {description}
            </p>
          )}

          {/* CTA Button */}
          <button
            type="button"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-500 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-600 active:scale-95"
          >
            SOLID 시작하기
          </button>

          {/* Dismiss */}
          <button
            type="button"
            className="mt-3 w-full py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-400"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
}
