"use client";

import { useState } from "react";
import { Badge } from "@/lib/types";
import { cn } from "@/lib/utils";
import BadgeDetailModal from "@/components/level/BadgeDetailModal";

interface BadgeCollectionProps {
  badges: Badge[];
}

export default function BadgeCollection({ badges }: BadgeCollectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earned = badges.filter((b) => b.isEarned).length;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-zinc-900">
          뱃지 컬렉션
        </h2>
        <span className="text-sm text-zinc-400">
          {earned} / {badges.length}
        </span>
      </div>
      <p className="text-sm text-zinc-400 mb-6">
        특별한 조건을 달성하면 뱃지를 획득할 수 있습니다
      </p>

      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            onClick={() => setSelectedBadge(badge)}
          />
        ))}
      </div>

      <BadgeDetailModal
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
}

interface BadgeCardProps {
  badge: Badge;
  onClick: () => void;
}

function BadgeCard({ badge, onClick }: BadgeCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border p-4 text-left transition-all",
        badge.isEarned
          ? "border-zinc-200 bg-white hover:shadow-md"
          : "border-zinc-100 bg-zinc-50/50"
      )}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Icon */}
        <div className="relative">
          <span
            className={cn(
              "text-4xl leading-none",
              !badge.isEarned && "opacity-30 grayscale"
            )}
          >
            {badge.icon}
          </span>
          {!badge.isEarned && (
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-300">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 12"
                fill="none"
                className="text-zinc-500"
              >
                <rect
                  x="2"
                  y="5"
                  width="6"
                  height="5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M3.5 5V3.5C3.5 2.12 4.12 1.5 5 1.5C5.88 1.5 6.5 2.12 6.5 3.5V5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Name */}
        <span
          className={cn(
            "text-sm font-bold",
            badge.isEarned
              ? "text-zinc-900"
              : "text-zinc-400"
          )}
        >
          {badge.name}
        </span>

        {/* Earned date or condition */}
        {badge.isEarned && badge.earnedAt ? (
          <span className="text-[11px] text-zinc-400">
            {formatDate(badge.earnedAt)} 획득
          </span>
        ) : (
          <span className="text-[11px] text-zinc-300">
            {badge.condition}
          </span>
        )}
      </div>
    </button>
  );
}
