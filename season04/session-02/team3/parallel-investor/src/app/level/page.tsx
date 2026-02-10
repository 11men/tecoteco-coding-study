// ============================================
// Feature D: Patience Leveling (참을성 레벨링)
// Owner: Team 3
// ============================================
// 이 페이지와 src/components/level/ 디렉토리는 Team 3이 담당합니다.
// 다른 팀은 이 파일을 수정하지 마세요.

import { MOCK_USER, MOCK_BADGES } from "@/lib/mock-data";
import LevelProfileCard from "@/components/level/LevelProfileCard";
import LevelTierProgress from "@/components/level/LevelTierProgress";
import BadgeCollection from "@/components/level/BadgeCollection";

export default function LevelPage() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          참을성 레벨
        </h1>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
          참음 횟수와 기간에 따라 레벨과 뱃지를 획득하세요.
        </p>
      </section>

      {/* 레벨 프로필 카드 */}
      <section>
        <LevelProfileCard
          level={MOCK_USER.level}
          nickname={MOCK_USER.nickname}
        />
      </section>

      {/* 레벨 티어 진행도 */}
      <section>
        <LevelTierProgress currentLevel={MOCK_USER.level.level} />
      </section>

      {/* 뱃지 컬렉션 */}
      <section>
        <BadgeCollection badges={MOCK_BADGES} />
      </section>
    </div>
  );
}
