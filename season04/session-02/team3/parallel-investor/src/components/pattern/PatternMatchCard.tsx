import Card from "@/components/ui/Card";
import BadgeUI from "@/components/ui/Badge";
import { PatternMatch } from "@/lib/types";
import { formatKRW, formatPercent, cn } from "@/lib/utils";

interface PatternMatchCardProps {
  match: PatternMatch;
  index: number;
}

export default function PatternMatchCard({ match, index }: PatternMatchCardProps) {
  const results = [
    { label: "7일 후", value: match.resultAfter7Days },
    { label: "30일 후", value: match.resultAfter30Days },
    { label: "90일 후", value: match.resultAfter90Days },
  ];

  return (
    <Card className="relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs text-zinc-400 mb-1">유사 패턴 #{index + 1}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{match.matchDate}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-extrabold text-blue-600">{match.similarity}%</p>
          <p className="text-xs text-zinc-400 mt-0.5">유사도</p>
        </div>
      </div>

      {/* Price at match */}
      <div className="mb-5">
        <p className="text-xs text-zinc-400 mb-1">당시 가격</p>
        <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {formatKRW(match.priceAtMatch)}
        </p>
      </div>

      {/* Results after periods */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {results.map((r) => (
          <div
            key={r.label}
            className={cn(
              "rounded-lg px-3 py-3 text-center",
              r.value >= 0
                ? "bg-emerald-50 dark:bg-emerald-950"
                : "bg-red-50 dark:bg-red-950"
            )}
          >
            <p className="text-xs text-zinc-500 mb-1">{r.label}</p>
            <p
              className={cn(
                "text-lg font-bold",
                r.value >= 0 ? "text-emerald-600" : "text-red-500"
              )}
            >
              {formatPercent(r.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex items-center gap-2 flex-wrap">
        <BadgeUI
          label={`RSI ${match.indicators.rsi}`}
          variant={match.indicators.rsi > 70 ? "danger" : match.indicators.rsi < 30 ? "success" : "default"}
        />
        <BadgeUI
          label={`MA ${formatKRW(match.indicators.movingAverage)}`}
          variant="info"
        />
        <BadgeUI
          label={`Vol ${(match.indicators.volume / 10000).toFixed(0)}만`}
          variant="default"
        />
      </div>
    </Card>
  );
}
