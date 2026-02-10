"use client";

import { Badge } from "@/lib/types";

interface AchievementFeedProps {
  badges: Badge[];
}

export default function AchievementFeed({ badges }: AchievementFeedProps) {
  const earnedBadges = badges
    .filter((b) => b.isEarned && b.earnedAt)
    .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime());

  if (earnedBadges.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-1">
      <h2 className="text-lg font-bold text-zinc-900">최근 업적</h2>
      <p className="text-sm text-zinc-400 mb-6">획득한 뱃지 기록</p>

      <div className="relative space-y-0">
        {earnedBadges.map((badge, index) => (
          <div key={badge.id} className="relative flex gap-4 pb-6">
            {/* Vertical line */}
            {index < earnedBadges.length - 1 && (
              <div className="absolute left-5 top-10 bottom-0 w-px bg-zinc-200" />
            )}

            {/* Emoji circle */}
            <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl">
              {badge.icon}
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-bold text-zinc-900">{badge.name}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{badge.description}</p>
              <p className="mt-1 text-[11px] text-zinc-400">
                {formatDate(badge.earnedAt!)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
