// ============================================
// Feature A: Pattern Similarity Engine
// Owner: Team 1
// ============================================
// 이 페이지와 src/components/pattern/ 디렉토리는 Team 1이 담당합니다.
// 다른 팀은 이 파일을 수정하지 마세요.

import Card from "@/components/ui/Card";

export default function PatternPage() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold">패턴 분석</h1>
        <p className="mt-1 text-sm text-zinc-500">
          사고 싶은 종목을 입력하면, 과거 유사 패턴의 결과를 보여드립니다.
        </p>
      </section>

      {/* TODO: Team 1 - 종목 검색 컴포넌트 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          🔍 종목 검색 컴포넌트가 들어갈 자리입니다 (Team 1)
        </p>
      </Card>

      {/* TODO: Team 1 - 패턴 매칭 결과 카드 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          📊 패턴 매칭 결과 카드가 들어갈 자리입니다 (Team 1)
        </p>
      </Card>

      {/* TODO: Team 1 - 사면/참으면 시나리오 비교 */}
      <Card>
        <p className="text-center text-zinc-400 py-12">
          ⚖️ 시나리오 비교 UI가 들어갈 자리입니다 (Team 1)
        </p>
      </Card>
    </div>
  );
}
