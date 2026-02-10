"use client";

import { Badge } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BadgeDetailModalProps {
  badge: Badge | null;
  onClose: () => void;
}

export default function BadgeDetailModal({ badge, onClose }: BadgeDetailModalProps) {
  if (!badge) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <span
            className={cn(
              "text-6xl leading-none",
              !badge.isEarned && "opacity-30 grayscale"
            )}
          >
            {badge.icon}
          </span>
        </div>

        {/* Name */}
        <h3
          className={cn(
            "mt-4 text-center text-xl font-bold",
            badge.isEarned ? "text-zinc-900" : "text-zinc-400"
          )}
        >
          {badge.name}
        </h3>

        {/* Description */}
        <p
          className={cn(
            "mt-2 text-center text-sm leading-relaxed",
            badge.isEarned ? "text-zinc-500" : "text-zinc-400"
          )}
        >
          {badge.description}
        </p>

        {/* Condition */}
        <p className="mt-1 text-center text-xs text-zinc-400">
          조건: {badge.condition}
        </p>

        {/* Earned date or not earned message */}
        <div className="mt-4 text-center">
          {badge.isEarned && badge.earnedAt ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              {formatDate(badge.earnedAt)} 획득
            </span>
          ) : (
            <span className="text-sm text-zinc-400">
              아직 획득하지 못했습니다
            </span>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-zinc-100 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
