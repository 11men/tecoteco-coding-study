"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MOCK_TICKERS,
  MOCK_ANALYSIS_RESULT,
  MOCK_PATTERN_MATCHES,
} from "@/lib/mock-data";
import { StockTicker, PatternAnalysisResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import TickerSearch from "@/components/pattern/TickerSearch";
import PatternMatchCard from "@/components/pattern/PatternMatchCard";
import ScenarioComparison from "@/components/pattern/ScenarioComparison";
import DefenseSuccess from "@/components/pattern/DefenseSuccess";

type PageState = "search" | "loading" | "result";
type LoadingPhase = 0 | 1 | 2;

export default function PatternPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const symbolParam = searchParams.get("symbol");

  const [state, setState] = useState<PageState>("search");
  const [selectedTicker, setSelectedTicker] = useState<StockTicker | null>(
    null
  );
  const [analysisResult, setAnalysisResult] =
    useState<PatternAnalysisResult | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showDefenseSuccess, setShowDefenseSuccess] = useState(false);

  // Auto-select ticker from URL param
  useEffect(() => {
    if (symbolParam && state === "search") {
      const found = MOCK_TICKERS.find(
        (t) => t.symbol.toLowerCase() === symbolParam.toLowerCase()
      );
      if (found) {
        setSelectedTicker(found);
        startAnalysis(found);
      }
    }
    // Only run on mount / when symbolParam changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolParam]);

  function startAnalysis(ticker: StockTicker) {
    setState("loading");
    setLoadingPhase(0);

    // Phase 1 at 500ms
    const t1 = setTimeout(() => setLoadingPhase(1), 500);
    // Phase 2 at 1000ms
    const t2 = setTimeout(() => setLoadingPhase(2), 1000);
    // Show result at 1500ms
    const t3 = setTimeout(() => {
      const result: PatternAnalysisResult = {
        ...MOCK_ANALYSIS_RESULT,
        ticker,
        capturedAt: new Date().toISOString(),
        matches: MOCK_PATTERN_MATCHES,
      };
      setAnalysisResult(result);
      setState("result");
    }, 1500);

    // Cleanup is not critical for mock, but good practice
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }

  const handleSelect = useCallback((ticker: StockTicker) => {
    if (!ticker) return;
    setSelectedTicker(ticker);
    startAnalysis(ticker);
  }, []);

  const handleNotBuy = useCallback(() => {
    setShowDefenseSuccess(true);
  }, []);

  const handleDefenseClose = useCallback(() => {
    setShowDefenseSuccess(false);
    router.push("/");
  }, [router]);

  const handleBuyAnyway = useCallback(() => {
    router.push("/history");
  }, [router]);

  // Highest similarity
  const topSimilarity =
    MOCK_PATTERN_MATCHES.length > 0
      ? Math.max(...MOCK_PATTERN_MATCHES.map((m) => m.similarity))
      : 0;

  const topMatch = MOCK_PATTERN_MATCHES.find(
    (m) => m.similarity === topSimilarity
  );

  // ─── SEARCH STATE ─────────────────────────────────
  if (state === "search") {
    return (
      <div className="flex flex-col gap-6 px-1 pt-4 sm:gap-8 sm:px-0">
        <section>
          <p className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-1">
            D&eacute;j&agrave; Buy
          </p>
          <h1 className="text-2xl font-bold text-zinc-100 sm:text-3xl">
            데자뷰 분석
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            전에 본 적 있는 패턴을 찾아볼게.
          </p>
        </section>

        <section>
          <TickerSearch onSelect={handleSelect} selectedTicker={selectedTicker} />
        </section>
      </div>
    );
  }

  // ─── LOADING STATE (dramatic reveal) ──────────────
  if (state === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        {/* Phase 0 */}
        <p
          className={cn(
            "text-zinc-500 animate-pulse transition-opacity duration-300",
            loadingPhase >= 1 ? "opacity-40" : "opacity-100"
          )}
        >
          분석 중...
        </p>

        {/* Phase 1 */}
        {loadingPhase >= 1 && (
          <p
            className={cn(
              "text-zinc-400 transition-opacity duration-300",
              loadingPhase >= 2 ? "opacity-40" : "opacity-100"
            )}
          >
            과거 패턴을 뒤지는 중...
          </p>
        )}

        {/* Phase 2 */}
        {loadingPhase >= 2 && (
          <p className="text-2xl font-bold text-blue-400 animate-pulse transition-transform duration-500 scale-100">
            D&eacute;j&agrave; Buy 감지.
          </p>
        )}
      </div>
    );
  }

  // ─── RESULT STATE ─────────────────────────────────
  if (state === "result" && analysisResult) {
    return (
      <>
        <div className="flex flex-col gap-8 px-1 pt-4 pb-8 sm:gap-10 sm:px-0">
          {/* 1. VERDICT SECTION (smaller, secondary) */}
          <section className="text-center">
            <p className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
              D&eacute;j&agrave; Buy 감지
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span
                className="text-4xl font-bold text-blue-400 font-mono"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(59,130,246,0.3))",
                }}
              >
                {topSimilarity}%
              </span>
              <span className="text-base text-zinc-400">유사</span>
            </div>
            {topMatch && (
              <p className="mt-2 text-zinc-400 text-sm">
                현재 패턴은 {topMatch.matchDate}{" "}
                {selectedTicker?.name ?? ""}과 거의 같습니다.
              </p>
            )}
          </section>

          {/* 2. SCENARIO COMPARISON — THE HERO */}
          <section className="w-full">
            <ScenarioComparison analysis={analysisResult} />
          </section>

          {/* 3. CTA SECTION — right here, no scrolling needed */}
          <section className="flex flex-col items-center gap-3 w-full">
            <button
              onClick={handleNotBuy}
              className="w-full rounded-xl bg-emerald-500 px-4 py-4 text-base font-semibold text-white transition-colors hover:bg-emerald-400 active:bg-emerald-600"
            >
              이번엔 안 산다
            </button>
            <button
              onClick={handleBuyAnyway}
              className="text-sm text-zinc-500 underline underline-offset-4 decoration-zinc-700 transition-colors hover:text-zinc-400 py-2"
            >
              그래도 산다
            </button>
          </section>

          {/* 4. PATTERN DETAIL (collapsible, all matches shown) */}
          <section>
            <button
              onClick={() => setDetailOpen(!detailOpen)}
              className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-700"
            >
              <span>과거 매칭 상세 보기</span>
              <svg
                className={cn(
                  "h-4 w-4 text-zinc-500 transition-transform duration-200",
                  detailOpen && "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {detailOpen && (
              <div className="mt-4 flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                {analysisResult.matches.map((match, i) => (
                  <PatternMatchCard key={match.id} match={match} index={i} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Defense Success Celebration Overlay */}
        {showDefenseSuccess && (
          <DefenseSuccess
            tickerName={selectedTicker?.name ?? ""}
            onClose={handleDefenseClose}
          />
        )}
      </>
    );
  }

  // Fallback
  return null;
}
