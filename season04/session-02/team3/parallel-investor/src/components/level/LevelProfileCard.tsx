"use client";

import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import BadgeUI from "@/components/ui/Badge";
import { UserLevel } from "@/lib/types";

interface LevelProfileCardProps {
  level: UserLevel;
  nickname: string;
}

export default function LevelProfileCard({ level, nickname }: LevelProfileCardProps) {
  const expPercent = (level.currentExp / level.nextLevelExp) * 100;

  return (
    <Card className="relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-teal-500/5" />
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-teal-500/10" />

      <div className="relative flex flex-col items-center gap-5 py-4">
        {/* Level number */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium tracking-wide text-zinc-400">
            {nickname}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-teal-500">Lv.</span>
            <span className="text-6xl font-extrabold tracking-tight text-zinc-900">
              {level.level}
            </span>
          </div>
        </div>

        {/* Title badges */}
        <div className="flex items-center gap-2">
          <BadgeUI label={level.title} variant="info" size="md" />
          <span className="text-sm text-zinc-400">
            {level.titleEn}
          </span>
        </div>

        {/* EXP progress */}
        <div className="w-full max-w-xs space-y-2">
          <ProgressBar
            value={level.currentExp}
            max={level.nextLevelExp}
            color="blue"
          />
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>EXP</span>
            <span>
              <span className="font-semibold text-zinc-700">
                {level.currentExp}
              </span>
              {" / "}
              {level.nextLevelExp}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
