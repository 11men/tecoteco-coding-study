// ============================================
// Feature A: Pattern Similarity Engine
// Owner: Team 1
// ============================================
// 이 페이지와 src/components/pattern/ 디렉토리는 Team 1이 담당합니다.
// 다른 팀은 이 파일을 수정하지 마세요.

"use client";

import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import { MOCK_ANALYSIS_RESULT, MOCK_PATTERN_MATCHES } from "@/lib/mock-data";
import { StockTicker, PatternAnalysisResult } from "@/lib/types";
import TickerSearch from "@/components/pattern/TickerSearch";
import PatternMatchCard from "@/components/pattern/PatternMatchCard";
import ScenarioComparison from "@/components/pattern/ScenarioComparison";
import MomentCapture from "@/components/pattern/MomentCapture";
import ActionGuide from "@/components/pattern/ActionGuide";
import PremiumLock from "@/components/pattern/PremiumLock";

type PageState = "idle" | "selected" | "loading" | "result";

export default function PatternPage() {
  const [state, setState] = useState<PageState>("idle");
  const [selectedTicker, setSelectedTicker] = useState<StockTicker | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PatternAnalysisResult | null>(null);

  const handleSelect = useCallback((ticker: StockTicker) => {
    setSelectedTicker(ticker);
    setState(ticker ? "selected" : "idle");
    setAnalysisResult(null);
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!selectedTicker) return;
    setState("loading");

    setTimeout(() => {
      const result: PatternAnalysisResult = {
        ...MOCK_ANALYSIS_RESULT,
        ticker: selectedTicker,
        capturedAt: new Date().toISOString(),
        matches: MOCK_PATTERN_MATCHES,
      };
      setAnalysisResult(result);
      setState("result");
    }, 1000);
  }, [selectedTicker]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-bold text-zinc-900 ">패턴 분석</h1>
        <p className="mt-1 text-sm text-zinc-500">
          사고 싶은 종목을 입력하면, 과거 유사 패턴의 결과를 보여드립니다.
        </p>
      </section>

      {/* Ticker Search */}
      <section>
        <TickerSearch onSelect={handleSelect} selectedTicker={selectedTicker} />
      </section>

      {/* Analyze Button */}
      {state === "selected" && selectedTicker && (
        <section className="flex justify-center">
          <Button size="lg" onClick={handleAnalyze}>
            &ldquo;{selectedTicker.name}&rdquo; 사고 싶다
          </Button>
        </section>
      )}

      {/* Loading */}
      {state === "loading" && (
        <section className="flex flex-col items-center gap-3 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">
            과거 유사 패턴을 분석하고 있습니다...
          </p>
        </section>
      )}

      {/* Results */}
      {state === "result" && analysisResult && (
        <>
          {/* Moment Capture */}
          <section>
            <MomentCapture analysis={analysisResult} />
          </section>

          {/* Pattern Match Cards */}
          <PremiumLock title="유사 패턴 분석">
            <section>
              <h2 className="text-lg font-bold text-zinc-900  mb-4">
                유사 패턴 {analysisResult.matches.length}건
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResult.matches.map((match, i) => (
                  <PatternMatchCard key={match.id} match={match} index={i} />
                ))}
              </div>
            </section>
          </PremiumLock>

          {/* Scenario Comparison */}
          <PremiumLock title="시나리오 비교">
            <section>
              <ScenarioComparison analysis={analysisResult} />
            </section>
          </PremiumLock>

          {/* Action Guide */}
          <section>
            <ActionGuide analysis={analysisResult} />
          </section>
        </>
      )}
    </div>
  );
}
