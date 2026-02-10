import Card from "@/components/ui/Card";
import { PatternAnalysisResult } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

interface ScenarioComparisonProps {
  analysis: PatternAnalysisResult;
}

export default function ScenarioComparison({ analysis }: ScenarioComparisonProps) {
  const { buyScenario, waitScenario } = analysis;

  return (
    <div>
      <h2 className="text-lg font-bold text-zinc-900 mb-4">
        시나리오 비교
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buy Scenario */}
        <Card variant="danger">
          <div className="text-center">
            <p className="text-sm font-semibold text-red-500 mb-1">지금 사면</p>
            <p className="text-xs text-zinc-500 mb-6">과거 유사 패턴 기준 예상 결과</p>

            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-1">7일 평균 수익률</p>
              <p className="text-3xl font-extrabold text-red-500">
                {formatPercent(buyScenario.avgReturn7d)}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-1">30일 평균 수익률</p>
              <p className="text-2xl font-bold text-red-500">
                {formatPercent(buyScenario.avgReturn30d)}
              </p>
            </div>

            <div className="rounded-lg bg-red-100 px-4 py-3">
              <p className="text-xs text-zinc-500 mb-0.5">손실 확률</p>
              <p className="text-2xl font-extrabold text-red-600">{buyScenario.lossRate}%</p>
            </div>
          </div>
        </Card>

        {/* Wait Scenario */}
        <Card variant="success">
          <div className="text-center">
            <p className="text-sm font-semibold text-emerald-600 mb-1">참으면</p>
            <p className="text-xs text-zinc-500 mb-6">기다렸다가 진입했을 때 예상 결과</p>

            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-1">7일 평균 수익률</p>
              <p className="text-3xl font-extrabold text-emerald-600">
                {formatPercent(waitScenario.avgReturn7d)}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-1">30일 평균 수익률</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatPercent(waitScenario.avgReturn30d)}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-100  px-4 py-3 mb-3">
              <p className="text-xs text-zinc-500 mb-0.5">수익 확률</p>
              <p className="text-2xl font-extrabold text-emerald-600">{waitScenario.gainRate}%</p>
            </div>

            <div className="rounded-lg bg-emerald-100  px-4 py-3">
              <p className="text-xs text-zinc-500 mb-0.5">적정 진입 시점</p>
              <p className="text-xl font-bold text-emerald-700">
                {waitScenario.optimalEntryDays}일 후
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
