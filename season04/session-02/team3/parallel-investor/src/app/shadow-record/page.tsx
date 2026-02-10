// ============================================
// Feature B: Shadow Record (참음의 기록)
// Owner: Team 2
// ============================================
// 이 페이지와 src/components/shadow-record/ 디렉토리는 Team 2가 담당합니다.
// 다른 팀은 이 파일을 수정하지 마세요.

import Card from "@/components/ui/Card";

export default function ShadowRecordPage() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold">참음의 기록</h1>
        <p className="mt-1 text-sm text-zinc-500">
          FOMO를 느꼈지만 참은 종목을 기록하고, 결과를 확인하세요.
        </p>
      </section>

      {/* TODO: Team 2 - FOMO 기록 폼 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          📝 FOMO 기록 폼이 들어갈 자리입니다 (Team 2)
        </p>
      </Card>

      {/* TODO: Team 2 - 참음 기록 리스트 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          📋 참음 기록 리스트가 들어갈 자리입니다 (Team 2)
        </p>
      </Card>

      {/* TODO: Team 2 - 결과 피드백 카드 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          🎉 결과 피드백 카드가 들어갈 자리입니다 (Team 2)
        </p>
      </Card>
    </div>
  );
}
