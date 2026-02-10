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
        그래서 어떻게 됐냐면
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Buy Scenario */}
        <Card variant="danger" className="w-full">
          <div className="text-center">
            <p className="text-sm font-semibold text-red-500 mb-1">또 사면</p>
            <p className="text-xs text-zinc-500 mb-6">전에도 이랬거든</p>

            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-1">7일 후</p>
              <p className="text-3xl font-extrabold text-red-500">
                {formatPercent(buyScenario.avgReturn7d)}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-1">30일 후</p>
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
        <Card variant="success" className="w-full">
          <div className="text-center">
            <p className="text-sm font-semibold text-emerald-600 mb-1">이번엔 끊으면</p>
            <p className="text-xs text-zinc-500 mb-6">기다린 사람은 이랬음</p>

            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-1">7일 후</p>
              <p className="text-3xl font-extrabold text-emerald-600">
                {formatPercent(waitScenario.avgReturn7d)}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-1">30일 후</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatPercent(waitScenario.avgReturn30d)}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-100 px-4 py-3 mb-3">
              <p className="text-xs text-zinc-500 mb-0.5">수익 확률</p>
              <p className="text-2xl font-extrabold text-emerald-600">{waitScenario.gainRate}%</p>
            </div>

            <div className="rounded-lg bg-emerald-100 px-4 py-3">
              <p className="text-xs text-zinc-500 mb-0.5">최적 타이밍</p>
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
