import Card from "@/components/ui/Card";
import { formatKRW } from "@/lib/utils";

interface JomoSummaryProps {
  totalDefendedAmount: number;
  totalRecords: number;
  defenseSuccessRate: number;
}

export default function JomoSummary({
  totalDefendedAmount,
  totalRecords,
  defenseSuccessRate,
}: JomoSummaryProps) {
  return (
    <Card variant="success">
      <div className="flex flex-col items-center gap-4 py-4">
        <p className="text-sm font-medium text-emerald-700">
          안 사서 번 돈
        </p>
        <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 text-center">
          {formatKRW(totalDefendedAmount)}
        </p>

        <div className="flex gap-8 mt-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-900">
              {totalRecords}
            </p>
            <p className="text-sm text-zinc-500">총 기록</p>
          </div>
          <div className="w-px bg-zinc-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {defenseSuccessRate}%
            </p>
            <p className="text-sm text-zinc-500">차단 성공률</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
