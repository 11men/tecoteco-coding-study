// ============================================
// Feature C: JOMO Calculator (자산 방어 시각화)
// Owner: Team 2
// ============================================
// 이 페이지와 src/components/jomo/ 디렉토리는 Team 2가 담당합니다.
// 다른 팀은 이 파일을 수정하지 마세요.

import Card from "@/components/ui/Card";

export default function JomoPage() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold">방어 현황</h1>
        <p className="mt-1 text-sm text-zinc-500">
          방어한 손실액을 실물 가치로 환산하여 보여드립니다.
        </p>
      </section>

      {/* TODO: Team 2 - 총 방어 금액 서머리 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          💰 총 방어 금액 서머리가 들어갈 자리입니다 (Team 2)
        </p>
      </Card>

      {/* TODO: Team 2 - 실물 환산 카드 리스트 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          🍗 실물 환산 카드 리스트가 들어갈 자리입니다 (Team 2)
        </p>
      </Card>
    </div>
  );
}
