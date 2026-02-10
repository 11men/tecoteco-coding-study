// ============================================
// Feature D: Patience Leveling (참을성 레벨링)
// Owner: Team 3
// ============================================
// 이 페이지와 src/components/level/ 디렉토리는 Team 3이 담당합니다.
// 다른 팀은 이 파일을 수정하지 마세요.

import Card from "@/components/ui/Card";

export default function LevelPage() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold">참을성 레벨</h1>
        <p className="mt-1 text-sm text-zinc-500">
          참음 횟수와 기간에 따라 레벨과 뱃지를 획득하세요.
        </p>
      </section>

      {/* TODO: Team 3 - 레벨 프로필 카드 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          ⭐ 레벨 프로필 카드가 들어갈 자리입니다 (Team 3)
        </p>
      </Card>

      {/* TODO: Team 3 - 레벨 티어 진행도 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          📈 레벨 티어 진행도가 들어갈 자리입니다 (Team 3)
        </p>
      </Card>

      {/* TODO: Team 3 - 뱃지 컬렉션 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          🏆 뱃지 컬렉션이 들어갈 자리입니다 (Team 3)
        </p>
      </Card>
    </div>
  );
}
