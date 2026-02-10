// ============================================
// Feature C: JOMO Calculator (자산 방어 시각화)
// Owner: Team 2
// ============================================
// 이 페이지와 src/components/jomo/ 디렉토리는 Team 2가 담당합니다.
// 다른 팀은 이 파일을 수정하지 마세요.

import { MOCK_USER } from "@/lib/mock-data";
import { calculateJomo } from "@/lib/utils";
import JomoSummary from "@/components/jomo/JomoSummary";
import JomoConversionGrid from "@/components/jomo/JomoConversionGrid";

export default function JomoPage() {
  const { totalDefendedAmount, totalRecords, defenseSuccessRate } = MOCK_USER;
  const jomo = calculateJomo(totalDefendedAmount);

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-0">
      <section>
        <h1 className="text-2xl font-bold sm:text-3xl">세이브</h1>
        <p className="mt-1 text-sm text-zinc-500">
          안 사서 번 돈으로 뭘 살 수 있었을까?
        </p>
      </section>

      <JomoSummary
        totalDefendedAmount={totalDefendedAmount}
        totalRecords={totalRecords}
        defenseSuccessRate={defenseSuccessRate}
      />

      <JomoConversionGrid items={jomo.items} />
    </div>
  );
}
