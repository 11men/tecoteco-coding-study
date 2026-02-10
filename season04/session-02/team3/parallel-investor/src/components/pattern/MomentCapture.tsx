import Card from "@/components/ui/Card";
import BadgeUI from "@/components/ui/Badge";
import { PatternAnalysisResult } from "@/lib/types";
import { formatKRW } from "@/lib/utils";

interface MomentCaptureProps {
  analysis: PatternAnalysisResult;
}

export default function MomentCapture({ analysis }: MomentCaptureProps) {
  const { ticker, capturedAt, matches } = analysis;

  // Use averaged indicators from matched patterns as the "captured" snapshot
  const avgRsi = Math.round(
    matches.reduce((sum, m) => sum + m.indicators.rsi, 0) / matches.length
  );
  const avgMA = Math.round(
    matches.reduce((sum, m) => sum + m.indicators.movingAverage, 0) /
      matches.length
  );
  const avgVolume = Math.round(
    matches.reduce((sum, m) => sum + m.indicators.volume, 0) / matches.length
  );

  const capturedDate = new Date(capturedAt);
  const formattedDate = `${capturedDate.getFullYear()}.${String(capturedDate.getMonth() + 1).padStart(2, "0")}.${String(capturedDate.getDate()).padStart(2, "0")} ${String(capturedDate.getHours()).padStart(2, "0")}:${String(capturedDate.getMinutes()).padStart(2, "0")}`;

  return (
    <Card variant="highlight">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-teal-700">
          &ldquo;사고 싶다&rdquo; 순간 캡처
        </h3>
        <span className="text-xs text-zinc-400">{formattedDate}</span>
      </div>

      <div className="mb-3">
        <p className="text-base font-semibold text-zinc-900">
          {ticker.name} ({ticker.symbol})
        </p>
        <p className="text-sm text-zinc-500">
          현재가 {formatKRW(ticker.currentPrice)}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <BadgeUI
          label={`RSI ${avgRsi}`}
          variant={avgRsi > 70 ? "danger" : avgRsi < 30 ? "success" : "default"}
        />
        <BadgeUI label={`MA ${formatKRW(avgMA)}`} variant="info" />
        <BadgeUI
          label={`Vol ${(avgVolume / 10000).toFixed(0)}만`}
          variant="default"
        />
      </div>
    </Card>
  );
}
